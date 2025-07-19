// frontend/src/services/paymentService.js - Updated for Backend Integration
import { supabase } from '../config/supabase'

// This function is deprecated - use createSubscriptionRecord instead
// Keeping for backward compatibility with enterprise inquiries
// If this function should interact with backend, it needs to be modified
// or moved to a backend endpoint. Assuming it's client-side only for inquiries
export const createPaymentRecord = async (paymentData) => {
    try {
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
            credits_included: '0',
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

// This function is now entirely handled by the backend
export const createSubscriptionRecord = async (subscriptionData) => {
    // This function should no longer be called directly from the frontend for payment processing.
    // The backend now handles this after successful payment verification.
    console.warn('createSubscriptionRecord is now handled by the backend for secure payment processing. Do not call directly from frontend.');
    return; // Or throw an error if you want to strictly prevent its use
}

// This function is now entirely handled by the backend
export const updateUserSubscription = async (userId, subscriptionData) => {
    // This function should no longer be called directly from the frontend for payment processing.
    // The backend now handles this after successful payment verification.
    console.warn('updateUserSubscription is now handled by the backend for secure payment processing. Do not call directly from frontend.');
    return; // Or throw an error if you want to strictly prevent its use
}

// Helper function to remove undefined values from objects (can be kept if other Supabase calls use it)
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