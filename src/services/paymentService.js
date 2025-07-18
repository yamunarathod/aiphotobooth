// services/paymentService.js
import { supabase } from '../config/supabase'


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
      // Convert userId to string as per your 'credits' table schema
      const userIdText = String(userId);

      // Check if creditsIncluded is 'unlimited'
      if (creditsIncluded === 'unlimited') {
        console.warn(`Plan is 'unlimited'. Skipping update to 'credits_left' in public.credits table for user: ${userIdText}.`);
        // If you want to represent 'unlimited' as a specific number (e.g., -1),
        // you would add that logic here.
      } else {
        const newCreditsToAdd = parseInt(creditsIncluded);

        if (isNaN(newCreditsToAdd)) {
          console.error(`Invalid credits_included value: ${creditsIncluded}. Must be a number for finite plans.`);
        } else {
          // Try to fetch existing credits record for the user
          const { data: existingCredits, error: fetchCreditsError } = await supabase
            .from('credits') // Using the new table name 'credits'
            .select('credits_left') // Using the correct column name 'credits_left'
            .eq('userId', userIdText) // Using the correct column name "userId"
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
              .from('credits') // Using the new table name 'credits'
              .update({
                credits_left: updatedCreditsBalance, // Storing as bigint
                updated_at: new Date().toISOString()
              })
              .eq('userId', userIdText); // Using the correct column name "userId"

            if (updateCreditsError) {
              console.error('Error updating user credits:', updateCreditsError);
            } else {
              console.log(`User credits updated for ${userIdText} to ${updatedCreditsBalance}`);
            }
          } else {
            // Create new credits record
            const { error: insertCreditsError } = await supabase
              .from('credits') // Using the new table name 'credits'
              .insert([
                {
                  "userId": userIdText, // Using the correct column name "userId"
                  credits_left: updatedCreditsBalance, // Storing as bigint
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);

            if (insertCreditsError) {
              console.error('Error creating user credits record:', insertCreditsError);
            } else {
              console.log(`New user credits record created for ${userIdText} with balance ${updatedCreditsBalance}`);
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