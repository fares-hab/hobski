import { supabase } from './supabase';

const VISITOR_KEY = 'hobski-visitor-id';

export function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function trackEvent(eventType, eventData = {}) {
  const visitorId = getVisitorId();
  supabase
    .from('analytics_events')
    .insert([{ visitor_id: visitorId, event_type: eventType, event_data: eventData }])
    .then(({ error }) => {
      if (error) console.error('Analytics error:', error);
    });
}
