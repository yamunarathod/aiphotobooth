// services/paymentService.js
import { supabase } from '../config/supabase'


<<<<<<< HEAD
export const createPaymentRecord = async (paymentData) => {
  try {
    const cleanedData = cleanObject({
      ...paymentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    const { error } = await supabase
      .from('payments')
      .insert([cleanedData])

    if (error) {
      throw new Error(`Error creating payment record: ${error.message}`)
    }

    console.log('Payment record created successfully.')
    return true
  } catch (error) {
    console.error('Error creating payment record:', error)
=======
// This function is deprecated - use createSubscriptionRecord instead
// Keeping for backward compatibility with enterprise inquiries
export const createPaymentRecord = async (paymentData) => {
  try {
    // For enterprise inquiries, we'll create a subscription record with special status 
    const subscriptionData = {
      userId: paymentData.userId,
      amount: paymentData.amount || 0,
      currency: paymentData.currency || 'INR',
      status: paymentData.status || 'enterprise_inquiry',
      payment_status: 'pending',
      user_name: paymentData.userName || paymentData.name,
      user_email: paymentData.email,
      plan_id: paymentData.planId,
      plan_name: paymentData.planName,
      credits_included: '0', // Enterprise credits to be determined
      credits_used: 0,
      billing_cycle: paymentData.billingCycle || 'custom',
      event_size: paymentData.eventSize,
      transforms_included: '0',
      transforms_used: 0,
      features: paymentData.metadata?.features || {},
      start_date: new Date().toISOString(),
      payment_date: new Date().toISOString(),
      metadata: {
        ...paymentData.metadata,
        inquiry_type: 'enterprise_plan_interest',
        originalFunction: 'createPaymentRecord'
      }
    }

    const { error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])

    if (error) {
      throw new Error(`Error creating enterprise inquiry record: ${error.message}`)
    }

    console.log('Enterprise inquiry record created successfully.')
    return true
  } catch (error) {
    console.error('Error creating enterprise inquiry record:', error)
>>>>>>> abraham
    throw error
  }
}

// Helper function to remove undefined values from objects
const cleanObject = (obj) => {
  const cleaned = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const cleanedNested = cleanObject(value)
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested
        }
      } else {
        cleaned[key] = value
      }
    }
  }
  return cleaned
}

<<<<<<< HEAD
export const updatePaymentRecord = async (paymentId, updateData) => {
  try {
    const cleanedData = cleanObject({
      ...updateData,
      updated_at: new Date().toISOString()
    })

    const { error } = await supabase
      .from('payments')
      .update(cleanedData)
      .eq('id', paymentId)

    if (error) {
      throw new Error(`Error updating payment record: ${error.message}`)
    }

    console.log('Payment record updated:', paymentId)
  } catch (error) {
    console.error('Error updating payment record:', error)
    throw error
  }
=======
// This function is deprecated - payment updates now happen in subscription records
export const updatePaymentRecord = async (paymentId, updateData) => {
  console.warn('updatePaymentRecord is deprecated. Payment updates should be made to subscription records.')
  // No-op for backward compatibility
  return true
>>>>>>> abraham
}

export const createSubscriptionRecord = async (subscriptionData) => {
  try {
    const cleanedData = cleanObject({
      ...subscriptionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([cleanedData])
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating subscription record: ${error.message}`)
    }

    console.log('Subscription record created with ID:', data.id)

    // --- NEW LOGIC TO UPDATE PUBLIC.CREDITS TABLE ---
    const userId = subscriptionData.userId; // This is a UUID from auth.users.id
    const creditsIncluded = subscriptionData.credits_included; // This can be 'unlimited' or a number

    if (userId && creditsIncluded !== undefined) {
<<<<<<< HEAD
      // Convert userId to string as per your 'credits' table schema
      const userIdText = String(userId);

      // Check if creditsIncluded is 'unlimited'
      if (creditsIncluded === 'unlimited') {
        console.warn(`Plan is 'unlimited'. Skipping update to 'credits_left' in public.credits table for user: ${userIdText}.`);
=======

      // Check if creditsIncluded is 'unlimited'
      if (creditsIncluded === 'unlimited') {
        console.warn(`Plan is 'unlimited'. Skipping update to 'credits_left' in user_credits table for user: ${userId}.`);
>>>>>>> abraham
        // If you want to represent 'unlimited' as a specific number (e.g., -1),
        // you would add that logic here.
      } else {
        const newCreditsToAdd = parseInt(creditsIncluded);

        if (isNaN(newCreditsToAdd)) {
          console.error(`Invalid credits_included value: ${creditsIncluded}. Must be a number for finite plans.`);
        } else {
          // Try to fetch existing credits record for the user
          const { data: existingCredits, error: fetchCreditsError } = await supabase
<<<<<<< HEAD
            .from('credits') // Using the new table name 'credits'
            .select('credits_left') // Using the correct column name 'credits_left'
            .eq('userId', userIdText) // Using the correct column name "userId"
=======
            .from('user_credits')
            .select('credits_left')
            .eq('user_id', userId) // Use UUID directly, not text
>>>>>>> abraham
            .single();

          if (fetchCreditsError && fetchCreditsError.code !== 'PGRST116') { // PGRST116 means 0 rows found (expected if no record)
            console.error('Error fetching user credits:', fetchCreditsError);
            // Do not throw, as subscription record was already created
          }

          let currentCreditsBalance = existingCredits ? parseInt(existingCredits.credits_left) : 0;
          if (isNaN(currentCreditsBalance)) {
              currentCreditsBalance = 0; // Default to 0 if existing was null/invalid
          }
          const updatedCreditsBalance = currentCreditsBalance + newCreditsToAdd;

          if (existingCredits) {
            // Update existing credits record
            const { error: updateCreditsError } = await supabase
<<<<<<< HEAD
              .from('credits') // Using the new table name 'credits'
              .update({
                credits_left: updatedCreditsBalance, // Storing as bigint
                updated_at: new Date().toISOString()
              })
              .eq('userId', userIdText); // Using the correct column name "userId"
=======
              .from('user_credits')
              .update({
                credits_left: String(updatedCreditsBalance), // Convert to string as per schema
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId); // Use UUID directly
>>>>>>> abraham

            if (updateCreditsError) {
              console.error('Error updating user credits:', updateCreditsError);
            } else {
<<<<<<< HEAD
              console.log(`User credits updated for ${userIdText} to ${updatedCreditsBalance}`);
=======
              console.log(`User credits updated for ${userId} to ${updatedCreditsBalance}`);
>>>>>>> abraham
            }
          } else {
            // Create new credits record
            const { error: insertCreditsError } = await supabase
<<<<<<< HEAD
              .from('credits') // Using the new table name 'credits'
              .insert([
                {
                  "userId": userIdText, // Using the correct column name "userId"
                  credits_left: updatedCreditsBalance, // Storing as bigint
=======
              .from('user_credits')
              .insert([
                {
                  user_id: userId, // Use UUID directly
                  credits_left: String(updatedCreditsBalance), // Convert to string as per schema
>>>>>>> abraham
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);

            if (insertCreditsError) {
              console.error('Error creating user credits record:', insertCreditsError);
            } else {
<<<<<<< HEAD
              console.log(`New user credits record created for ${userIdText} with balance ${updatedCreditsBalance}`);
=======
              console.log(`New user credits record created for ${userId} with balance ${updatedCreditsBalance}`);
>>>>>>> abraham
            }
          }
        }
      }
    } else {
      console.warn('Credits not included or userId missing in subscriptionData, skipping public.credits update.');
    }
    // --- END NEW LOGIC ---

    return data.id
  } catch (error) {
    console.error('Error creating subscription record:', error)
    throw error
  }
}

export const updateUserSubscription = async (userId, subscriptionData) => {
  try {
    const cleanedData = cleanObject({
      subscription: subscriptionData,
      updated_at: new Date().toISOString()
    });

    // First, try to update existing user record
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Error checking user existence: ${fetchError.message}`)
    }

    if (existingUser) {
      // User exists, update the record
      const { error: updateError } = await supabase
        .from('users')
        .update(cleanedData)
        .eq('id', userId)

      if (updateError) {
        throw new Error(`Error updating user subscription: ${updateError.message}`)
      }
    } else {
      // User doesn't exist, create new record
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          ...cleanedData,
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        throw new Error(`Error creating user subscription: ${insertError.message}`)
      }
    }

    console.log('User subscription data set (created or updated):', userId);
  } catch (error) {
    console.error('Error setting user subscription data:', error);
    throw error;
  }
};