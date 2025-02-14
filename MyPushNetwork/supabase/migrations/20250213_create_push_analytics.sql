-- Create push_analytics table
create table if not exists push_analytics (
    id text primary key,
    total_subscribers integer default 0,
    unsubscribed_count integer default 0,
    last_updated timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

-- Add new columns to notifications table
alter table notifications add column if not exists failed_count integer default 0;
alter table notifications add column if not exists total_subscribers integer default 0;
alter table notifications add column if not exists delivery_rate decimal default 0;
alter table notifications add column if not exists targeting_summary jsonb default '{}'::jsonb;
alter table notifications add column if not exists error_summary jsonb default '{}'::jsonb;

-- Create or replace function to get analytics
create or replace function get_push_analytics()
returns json
language plpgsql
security definer
as $$
declare
    result json;
begin
    select json_build_object(
        'total_subscribers', coalesce((select total_subscribers from push_analytics where id = 'global'), 0),
        'unsubscribed_count', coalesce((select unsubscribed_count from push_analytics where id = 'global'), 0),
        'active_subscribers', (select count(*) from push_tokens),
        'campaigns_sent', (select count(*) from notifications where status = 'sent'),
        'campaigns_failed', (select count(*) from notifications where status = 'failed'),
        'average_delivery_rate', (
            select coalesce(avg(delivery_rate), 0)
            from notifications
            where status = 'sent'
        ),
        'by_country', (
            select json_object_agg(country, count)
            from (
                select country, count(*)
                from push_tokens
                group by country
            ) as country_stats
        ),
        'by_device', (
            select json_build_object(
                'desktop', count(*) filter (where user_agent not like '%Mobile%' and user_agent not like '%Android%' and user_agent not like '%iOS%'),
                'mobile', count(*) filter (where user_agent like '%Mobile%' or user_agent like '%Android%' or user_agent like '%iOS%')
            )
            from push_tokens
        ),
        'last_updated', (select last_updated from push_analytics where id = 'global')
    ) into result;

    return result;
end;
$$;
