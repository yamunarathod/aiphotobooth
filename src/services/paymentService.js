// services/paymentService.js
import { supabase } from '../config/supabase'


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

// This function is deprecated - payment updates now happen in subscription records
export const updatePaymentRecord = async (paymentId, updateData) => {
  console.warn('updatePaymentRecord is deprecated. Payment updates should be made to subscription records.')
  // No-op for backward compatibility
  return true
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

      // Check if creditsIncluded is 'unlimited'
      if (creditsIncluded === 'unlimited') {
        console.warn(`Plan is 'unlimited'. Skipping update to 'credits_left' in user_credits table for user: ${userId}.`);
        // If you want to represent 'unlimited' as a specific number (e.g., -1),
        // you would add that logic here.
      } else {
        const newCreditsToAdd = parseInt(creditsIncluded);

        if (isNaN(newCreditsToAdd)) {
          console.error(`Invalid credits_included value: ${creditsIncluded}. Must be a number for finite plans.`);
        } else {
          // Try to fetch existing credits record for the user
          const { data: existingCredits, error: fetchCreditsError } = await supabase
            .from('user_credits')
            .select('credits_left')
            .eq('user_id', userId) // Use UUID directly, not text
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
              .from('user_credits')
              .update({
                credits_left: String(updatedCreditsBalance), // Convert to string as per schema
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId); // Use UUID directly

            if (updateCreditsError) {
              console.error('Error updating user credits:', updateCreditsError);
            } else {
              console.log(`User credits updated for ${userId} to ${updatedCreditsBalance}`);
            }
          } else {
            // Create new credits record
            const { error: insertCreditsError } = await supabase
              .from('user_credits')
              .insert([
                {
                  user_id: userId, // Use UUID directly
                  credits_left: String(updatedCreditsBalance), // Convert to string as per schema
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);

            if (insertCreditsError) {
              console.error('Error creating user credits record:', insertCreditsError);
            } else {
              console.log(`New user credits record created for ${userId} with balance ${updatedCreditsBalance}`);
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