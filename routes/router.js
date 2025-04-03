const express = require('express')
const controllers = require('../controllers/controller')
const router = express.Router()


router.get('/register',controllers.register)
router.get('/login',controllers.login)
router.get('/dashboard',controllers.dashboard)

//post
router.post('/register',controllers.createUser)
router.post('/login',controllers.getUser)
router.post('/logout',controllers.logout)

module.exports = router