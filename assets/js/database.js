// Database initialization and table creation
async function initializeDatabase() {
    const { createClient } = supabase;
    const supabaseClient = createClient(config.supabase.url, config.supabase.serviceRole);

    try {
        console.log('Initializing database...');
        
        // First, try to call our RPC function
        const { error: rpcError } = await supabaseClient
            .rpc('create_notifications_table_if_not_exists');

        if (rpcError) {
            console.error('Error calling RPC function:', rpcError);
            console.log('RPC function may not exist. Please create it in Supabase using this SQL:');
            console.log(`
                create or replace function public.create_notifications_table_if_not_exists()
                returns void
                language plpgsql
                as $$
                begin
                    if not exists (
                        select 1
                        from information_schema.tables 
                        where table_schema = 'public' and table_name = 'notifications'
                    ) then
                        create table public.notifications (
                            id uuid default uuid_generate_v4() primary key,
                            campaign_name text not null,
                            title text not null,
                            message text not null,
                            cta_text text not null,
                            click_url text not null,
                            icon_url text not null,
                            image_url text,
                            target_countries text[] not null,
                            target_device text not null,
                            schedule_time timestamptz not null,
                            created_at timestamptz default now(),
                            status text not null,
                            sent_count integer default 0,
                            click_count integer default 0,
                            view_count integer default 0
                        );

                        -- Enable RLS and set permissions
                        alter table public.notifications enable row level security;
                        grant all on public.notifications to authenticated;
                        grant all on public.notifications to service_role;

                        -- Create policy
                        create policy "Allow all operations for authenticated users"
                        on public.notifications
                        for all
                        to authenticated
                        using (true)
                        with check (true);
                    end if;
                end;
                $$;
            `);
            return;
        }

        // Verify the table exists and has the correct schema
        const { data, error } = await supabaseClient
            .from('notifications')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error verifying table:', error);
            return;
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Execute when the page loads
document.addEventListener('DOMContentLoaded', initializeDatabase);
