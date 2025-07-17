// utils/razorpay.js - Complete Fixed Version
import {
  createSubscriptionRecord, // Removed updatePaymentRecord as it's not needed now
  updateUserSubscription
} from '../services/paymentService'

// Generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const makeRazorpayPayment = async ({
  name,
  email,
  amountInRupees,
  planDetails,
  userId,
  eventSize,
  billingCycle,
  onSuccess,
  onFailure
}) => {
  const isLoaded = await loadRazorpayScript()
  if (!isLoaded) {
    alert("Razorpay SDK failed to load. Are you online?")
    return
  }

  // Generate payment record ID upfront to avoid service issues
  const paymentRecordId = generateUUID()

  try {
    const options = {
      key: "rzp_test_WT0igFhb5cfHNE",
      amount: amountInRupees * 100,
      currency: "INR",
      name: " Photobooth AI",
      description: `${planDetails.name} Plan - ${billingCycle}`,
      image: "/logo.png",
      handler: async function (response) {
        try {
          console.log('Payment success response:', response)
          const subscriptionId = generateUUID()

          const subscriptionData = {
            id: subscriptionId,
            userId,
            amount: Math.round(amountInRupees * 100),
            currency: 'INR',
            status: 'active',
            payment_status: 'completed', // New field
            payment_reference_number: response.razorpay_payment_id, // New field for razorpayPaymentId
            razorpay_payment_id: response.razorpay_payment_id, // Specific Razorpay ID
            razorpay_order_id: response.razorpay_order_id || null,
            razorpay_signature: response.razorpay_signature || null,
            mode_of_payment: 'Razorpay', // New field
            user_name: name, // New field
            user_email: email, // New field
            plan_id: planDetails.id, // New field
            plan_name: planDetails.name, // New field
            credits_included: planDetails.transformsIncluded, // New field
            credits_used: 0, // New field
            billing_cycle: billingCycle,
            event_size: eventSize,
            transforms_included: planDetails.transformsIncluded,
            transforms_used: 0,
            features: planDetails.features,
            start_date: new Date().toISOString(), // New field
            next_billing_date: getNextBillingDate(billingCycle),
            auto_renew: true, // New field
            payment_date: new Date().toISOString(), // New field for payment date/time
            metadata: {
              completedAt: new Date().toISOString(),
              razorpayResponse: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || null,
                razorpay_signature: response.razorpay_signature || null
              }
            }
          }

          try {
            await createSubscriptionRecord(subscriptionData)
            console.log('Subscription record created:', subscriptionId)
          } catch (subError) {
            console.error('Failed to create subscription record:', subError)
            throw new Error('Failed to create subscription')
          }

          // Update user subscription
          const userSubscriptionData = {
            planId: planDetails.id,
            subscriptionId,
            status: 'active',
            transformsRemaining: planDetails.transformsIncluded === 'unlimited'
              ? 'unlimited'
              : parseInt(planDetails.transformsIncluded),
            metadata: {
              planName: planDetails.name,
              billingCycle,
              nextBillingDate: getNextBillingDate(billingCycle),
              paymentId: paymentRecordId,
              razorpayPaymentId: response.razorpay_payment_id
            }
          }

          try {
            await updateUserSubscription(userId, userSubscriptionData)
            console.log('User subscription updated successfully')
          } catch (userSubError) {
            console.error('Failed to update user subscription:', userSubError)
            throw new Error('Failed to update user subscription')
          }

          onSuccess({
            ...response,
            subscriptionId,
            paymentRecordId,
            message: 'Payment completed successfully!'
          })

        } catch (error) {
          console.error('Error processing payment success:', error)

          onFailure({
            error: {
              description: 'Payment succeeded but subscription activation failed. Please contact support with payment ID: ' + response.razorpay_payment_id
            }
          })
        }
      },
      prefill: { name, email },
      notes: {
        userId,
        planId: planDetails.id,
        paymentRecordId
      },
      theme: { color: "#8b5cf6" },
      modal: {
        ondismiss: async function () {
          console.log('Payment modal dismissed')
          // No action needed for payment record update as we are only using subscription table
        }
      }
    }

    const rzp = new window.Razorpay(options)

    rzp.on("payment.failed", async function (response) {
      console.log('Payment failed:', response)
      // No action needed for payment record update as we are only using subscription table
      onFailure(response.error)
    })

    rzp.open()

  } catch (error) {
    console.error('Error initiating payment:', error)
    onFailure({
      error: {
        description: `Failed to initialize payment: ${error.message}`
      }
    })
  }
}

const getNextBillingDate = (billingCycle) => {
  const now = new Date()
  if (billingCycle === 'monthly') {
    const nextMonth = new Date(now)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return nextMonth.toISOString()
  }
  if (billingCycle === 'yearly') {
    const nextYear = new Date(now)
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    return nextYear.toISOString()
  }
  return null
}

// Export utility functions for debugging
export { generateUUID }