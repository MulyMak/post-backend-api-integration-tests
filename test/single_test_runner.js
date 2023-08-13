//// Main ////
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
require('./MainTests/create_test_users')
require(`./${process.env.FILE_NAME}`)
