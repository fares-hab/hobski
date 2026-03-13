import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all'); // 'all', '7d', '30d'

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  async function fetchMetrics() {
    setLoading(true);

    let query = supabase.from('analytics_events').select('*');

    if (dateRange === '7d') {
      query = query.gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
    } else if (dateRange === '30d') {
      query = query.gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Analytics fetch error:', error);
      setLoading(false);
      return;
    }

    const uniqueVisitors = new Set(data.map(e => e.visitor_id)).size;
    const pageViews = data.filter(e => e.event_type === 'page_view');
    const formClicks = data.filter(e => e.event_type === 'form_click');
    const formCompletes = data.filter(e => e.event_type === 'form_complete');

    const learnerClicks = formClicks.filter(e => e.event_data?.form === 'learner').length;
    const mentorClicks = formClicks.filter(e => e.event_data?.form === 'mentor').length;
    const learnerCompletes = formCompletes.filter(e => e.event_data?.form === 'learner').length;
    const mentorCompletes = formCompletes.filter(e => e.event_data?.form === 'mentor').length;

    setMetrics({
      uniqueVisitors,
      totalPageViews: pageViews.length,
      landingViews: pageViews.filter(e => e.event_data?.page === '/').length,
      learnerPageViews: pageViews.filter(e => e.event_data?.page === '/signup/learner').length,
      mentorPageViews: pageViews.filter(e => e.event_data?.page === '/signup/mentor').length,
      learnerClicks,
      mentorClicks,
      totalFormClicks: formClicks.length,
      learnerCompletes,
      mentorCompletes,
      totalFormCompletes: formCompletes.length,
      conversionRate: uniqueVisitors > 0 ? ((formCompletes.length / uniqueVisitors) * 100).toFixed(1) : '0',
    });

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400 mb-8">hobski event tracking</p>

        <div className="flex gap-2 mb-8">
          {['all', '30d', '7d'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range === 'all' ? 'All Time' : range === '30d' ? 'Last 30 Days' : 'Last 7 Days'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !metrics ? (
          <p className="text-red-400">Failed to load analytics.</p>
        ) : (
          <div className="space-y-8">
            {/* Top-level metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card label="Unique Visitors" value={metrics.uniqueVisitors} />
              <Card label="Total Page Views" value={metrics.totalPageViews} />
              <Card label="Form Completions" value={metrics.totalFormCompletes} />
              <Card label="Conversion Rate" value={`${metrics.conversionRate}%`} />
            </div>

            {/* Page views breakdown */}
            <Section title="Page Views">
              <Row label="Landing Page" value={metrics.landingViews} />
              <Row label="Learner Signup" value={metrics.learnerPageViews} />
              <Row label="Mentor Signup" value={metrics.mentorPageViews} />
            </Section>

            {/* Form clicks */}
            <Section title="Form Clicks (from Landing Page)">
              <Row label="Learner" value={metrics.learnerClicks} />
              <Row label="Mentor" value={metrics.mentorClicks} />
              <Row label="Total" value={metrics.totalFormClicks} bold />
            </Section>

            {/* Form completions */}
            <Section title="Form Completions">
              <Row label="Learner" value={metrics.learnerCompletes} />
              <Row label="Mentor" value={metrics.mentorCompletes} />
              <Row label="Total" value={metrics.totalFormCompletes} bold />
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? 'border-t border-gray-700 pt-3 font-semibold' : 'text-gray-300'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
