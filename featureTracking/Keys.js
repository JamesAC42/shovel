const features = [
    'created_account',
    'logged_in',
    'created_room',
    'joined_room',
    'renamed_room',
    'deleted_room',
    'check_in',
    'added_goal',
    'deleted_goal',
    'archived_goal',
    'reordered_goal',
    'added_task',
    'deleted_task',
    'checked_task',
    'unchecked_task',
    'reordered_task',
    'added_work_hour',
    'removed_work_hour',
    'toggled_accomplishment',
    'saved_journal',
    'deleted_journal'
]

const Keys = {

    // active users // set of userids
    daily_active_users: 'shovel:featureTracking:daily_active_users:', // {timestamp}
    weekly_active_users: 'shovel:featureTracking:weekly_active_users:', // {timestamp}
    monthly_active_users: 'shovel:featureTracking:monthly_active_users:', // {timestamp}

    // new users // set of userids
    daily_new_users: 'shovel:featureTracking:daily_new_users:', // {timestamp}
    weekly_new_users: 'shovel:featureTracking:weekly_new_users:', // {timestamp}
    monthly_new_users: 'shovel:featureTracking:monthly_new_users:', // {timestamp}

    // requests // int
    daily_requests: 'shovel:featureTracking:daily_requests:', // {timestamp}
    weekly_requests: 'shovel:featureTracking:weekly_requests:', // {timestamp}
    monthly_requests: 'shovel:featureTracking:monthly_requests:', // {timestamp}
    
    // feature usage // sorted set
    daily_feature_usage: 'shovel:featureTracking:daily_feature_usage:', // {feature}:{timestamp}
    weekly_feature_usage: 'shovel:featureTracking:weekly_feature_usage:', // {feature}:{timestamp}
    monthly_feature_usage: 'shovel:featureTracking:monthly_feature_usage:', // {feature}:{timestamp}

    // user info // hash
    user_info: 'shovel:featureTracking:user_info:', // {userid}
    /*
    {
        last_login: <timestamp>,
    }
    */

    // popular_features // sorted set
    popular_features: 'shovel:featureTracking:popular_features', // {timestamp}
}

module.exports = { Keys, features };
