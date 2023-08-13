//// Main ////
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
require('./MainTests/create_test_users')

// User ////

require('./ProfileTests/authentication_test')
require('./ProfileTests/create_user_test')

require('./ProfileTests/update_profile_test')
require('./ProfileTests/follow_unfollow_test')
require('./ProfileTests/block_unblock_profile_test')
require('./ProfileTests/ratings_test')

//// Post ////

require('./PostTests/create_media_test')
require('./PostTests/create_post_test')
require('./PostTests/update_post_test')
require('./PostTests/create_repost_test')
require('./PostTests/update_repost_test')
require('./PostTests/create_comment_reply_test')
require('./PostTests/upvote_downvote_post_test')
// // require('./PostTests/mark_as_viewed_test')       //NEEDS TO BE UPDATED

//// General Search ////

require('./GeneralSearchTest/search_users_test')
require('./GeneralSearchTest/search_posts_test')

//// Notifications ////

require('./NotificationsTests/follow_notif_test')
require('./NotificationsTests/post_vote_notif_test')
require('./NotificationsTests/get_other_user_notifications_test')
require('./NotificationsTests/comment_notif_test')
require('./NotificationsTests/mark_notif_as_viewed_test')
require('./NotificationsTests/moderation_post_notif_test')
require('./NotificationsTests/deleted_post_notif_test')
