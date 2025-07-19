// frontend/src/utils/razorpay.js

// Make sure generateUUID is defined or imported if it's not a global function.
// For example:
// import { v4 as uuidv4 } from 'uuid'; // if you installed 'uuid' package
// const generateUUID = () => uuidv4();
// Or if you have it elsewhere:
// import { generateUUID } from './your-utils-file';
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const makeRazorpayPayment = async ({
  name,
  email,
  amountInRupees,
  planDetails,
  userId,
  authUserId, // Not directly used by Razorpay, but good for notes or your backend
  eventSize,
  billingCycle,
  onSuccess,
  onFailure,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure({
      error: {
        description: "Razorpay SDK failed to load. Are you online?"
      }
    });
    return;
  }
  console.log('Razorpay SDK loaded successfully');

  const paymentRecordId = generateUUID(); // Unique ID for your internal tracking

  try {
    // Step 1: Request order creation from your backend
    const createOrderResponse = await fetch('http://localhost:5000/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amountInRupees: amountInRupees, // Frontend sends USD amount
        currency: "INR", // Indicate desired payment currency
        userId: userId // Pass userId to backend for receipt generation
      })
    });

    console.log('Order creation raw response:', createOrderResponse);

    let orderData;
    try {
        orderData = await createOrderResponse.json();
        console.log('Order creation parsed data:', orderData);
    } catch (jsonError) {
        console.error('Error parsing JSON from create-order response:', jsonError);
        const textResponse = await createOrderResponse.text();
        console.error('Raw text response from create-order:', textResponse);
        throw new Error('Invalid JSON response from backend.');
    }

    if (!createOrderResponse.ok || !orderData.success) {
      console.error('Backend responded with error or success: false', orderData);
      throw new Error(orderData.message || 'Failed to create order on backend.');
    }

    const { order } = orderData; // Extract the order object from the response

    console.log('Successfully extracted order object:', order);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // This is now correct
    
      name: "Photobooth AI",
      description: `Subscription for ${planDetails.name} Plan`,
      order_id: order.id,         // <-- This is the most important part!
      handler: async function (response) {
        // This function is called when the payment is successful
        try {
          console.log('RAZORPAY HANDLER: Payment success response from Razorpay:', response);

          // Step 2: Send payment success details to your Node.js backend for verification
          const verificationResponse = await fetch('http://localhost:5000/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
              name: name,
              email: email,
              amountInRupees: amountInRupees, // Pass original USD amount for record-keeping
              planDetails: planDetails,
              eventSize: eventSize,
              billingCycle: billingCycle,
              paymentRecordId: paymentRecordId,
              authUserId: authUserId // Include authUserId for consistency/reference if needed
            })
          });

          const verificationData = await verificationResponse.json();
          console.log('RAZORPAY HANDLER: Verification backend response:', verificationData);


          if (!verificationResponse.ok || !verificationData.success) {
            console.error('RAZORPAY HANDLER: Verification failed on server.', verificationData);
            throw new Error(verificationData.message || 'Payment verification failed on server.');
          }

          console.log('RAZORPAY HANDLER: Calling onSuccess callback.');
          onSuccess({
            ...response,
            message: verificationData.message || 'Payment completed successfully!',
            subscriptionId: verificationData.subscriptionId // If your backend returns it
          });

        } catch (error) {
          console.error('RAZORPAY HANDLER CATCH: Error during payment verification or database update:', error);
          onFailure({
            error: {
              description: `Payment succeeded but verification/activation failed. Please contact support. Error: ${error.message}`
            }
          });
        }
      },
      prefill: {
        name,
        email
      },
      notes: {
        userId,
        planId: planDetails.id,
        paymentRecordId: paymentRecordId
      },
      theme: {
        color: "#8b5cf6"
      },
      modal: {
        ondismiss: async function () {
          console.log('RAZORPAY MODAL: Payment modal dismissed');
          onFailure({
            error: {
              description: 'Payment was cancelled or dismissed by the user.'
            }
          });
        }
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function (response) {
      console.log('RAZORPAY EVENT: Payment failed!', response); // Log for actual Razorpay failure
      onFailure(response.error);
    });

    rzp.open(); // Open the Razorpay payment modal

  } catch (error) {
    console.error('TOP-LEVEL CATCH: Error initiating payment process:', error); // Catches errors before Razorpay modal opens (e.g., fetch errors, JSON parsing errors)
    onFailure({
      error: {
        description: `Failed to initiate payment: ${error.message}`
      }
    });
  }
};