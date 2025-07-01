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