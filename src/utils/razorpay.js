// utils/razorpay.js - Complete Fixed Version
import {
  createPaymentRecord,
  updatePaymentRecord,
  createSubscriptionRecord,
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
    // Create minimal payment record with explicit ID
    const initialPaymentData = {
      id: paymentRecordId, // Explicit ID to avoid service return issues
      userId,
      amount: Math.round(amountInRupees * 100),
      currency: 'INR',
      status: 'initiated',
      metadata: {
        userEmail: email,
        userName: name,
        planId: planDetails.id,
        planName: planDetails.name,
        billingCycle,
        eventSize,
        paymentMethod: 'razorpay',
        transformsIncluded: planDetails.transformsIncluded,
        features: planDetails.features,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    }

    console.log('Creating payment record with ID:', paymentRecordId)
    
    // Create payment record - ignore return value since we're using explicit ID
    try {
      await createPaymentRecord(initialPaymentData)
      console.log('Payment record created successfully')
    } catch (error) {
      console.error('Failed to create payment record:', error)
      // Continue anyway as we'll track the payment manually
    }

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
          console.log('Updating payment record ID:', paymentRecordId)

          const updateData = {
            status: 'completed',
            razorpayPaymentId: response.razorpay_payment_id,
            metadata: {
              ...initialPaymentData.metadata,
              completedAt: new Date().toISOString(),
              razorpayResponse: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || null,
                razorpay_signature: response.razorpay_signature || null
              }
            }
          }

          try {
            await updatePaymentRecord(paymentRecordId, updateData)
            console.log('Payment record updated successfully')
          } catch (updateError) {
            console.error('Failed to update payment record:', updateError)
            // Continue with subscription creation even if update fails
          }

          // Create subscription record with explicit ID
          const subscriptionId = generateUUID()
          // Inside the handler function in razorpay.js

const subscriptionData = {
  id: subscriptionId,
  userId,
  // Convert to paise and ensure it's an integer
  amount: Math.round(amountInRupees * 100), 
  currency: 'INR',
  status: 'active',
  metadata: {
    userEmail: email,
    userName: name,
    paymentId: paymentRecordId,
    planId: planDetails.id,
    planName: planDetails.name,
    billingCycle,
    eventSize,
    transformsIncluded: planDetails.transformsIncluded,
    transformsUsed: 0,
    features: planDetails.features,
    startDate: new Date().toISOString(),
    nextBillingDate: getNextBillingDate(billingCycle),
    autoRenew: true,
    razorpayPaymentId: response.razorpay_payment_id
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
          
          // Try to update payment record with error status
          try {
            await updatePaymentRecord(paymentRecordId, {
              status: 'processing_error',
              metadata: {
                ...initialPaymentData.metadata,
                error: error.message,
                errorAt: new Date().toISOString(),
                razorpayResponse: response
              }
            })
          } catch (updateError) {
            console.error('Failed to update payment record with error:', updateError)
          }
          
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
          
          try {
            await updatePaymentRecord(paymentRecordId, {
              status: 'cancelled',
              metadata: {
                ...initialPaymentData.metadata,
                cancelledAt: new Date().toISOString(),
                cancellationReason: 'user_dismissed_modal'
              }
            })
          } catch (error) {
            console.error('Failed to update payment record on dismiss:', error)
          }
        }
      }
    }

    const rzp = new window.Razorpay(options)
    
    rzp.on("payment.failed", async function (response) {
      console.log('Payment failed:', response)
      
      try {
        await updatePaymentRecord(paymentRecordId, {
          status: 'failed',
          metadata: {
            ...initialPaymentData.metadata,
            failedAt: new Date().toISOString(),
            error: response.error,
            razorpayError: response.error
          }
        })
      } catch (error) {
        console.error('Failed to update payment record on failure:', error)
      }
      
      onFailure(response.error)
    })

    rzp.open()

  } catch (error) {
    console.error('Error initiating payment:', error)
    
    try {
      await updatePaymentRecord(paymentRecordId, {
        status: 'initialization_failed',
        metadata: {
          error: error.message,
          failedAt: new Date().toISOString()
        }
      })
    } catch (updateError) {
      console.error('Failed to update payment record on init error:', updateError)
    }
    
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