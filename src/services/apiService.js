import { supabase } from '../config/supabase'

/**
 * Creates a new event document in Supabase.
 * @param {object} eventData - The event data, must include name and userId.
 * @returns {string} The ID of the newly created event.
 */
const createEvent = async (eventData) => {
  if (!eventData.name || !eventData.userId) {
    throw new Error('Event name and user ID are required.');
  }

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        ...eventData,
        created_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating event: ${error.message}`);
  }

  return data.id;
};

/**
 * Fetches all events for a specific user.
 * @param {string} userId - The UID of the user.
 * @returns {Array} An array of event objects.
 */
const getEventsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('userId', userId);

  if (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }

  return data || [];
};

const apiService = {
  events: {
    create: createEvent,
    getByUserId: getEventsByUserId,
  },
  // You can move other service calls here as well,
  // like getServiceRequestsByEventId from EventDetails.jsx
};

export default apiService;