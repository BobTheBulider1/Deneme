const SUPABASE_URL = 'https://xhgslxymqkjqmibzhpmd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZ3NseHltcWtqcW1pYnpocG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NjMwMDMsImV4cCI6MjA5NTAzOTAwM30.MxHe40SKKgF-NKpmknr1pldFZOIp9D90eQ9_1czrZfo';

// Initialize the Supabase client
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
