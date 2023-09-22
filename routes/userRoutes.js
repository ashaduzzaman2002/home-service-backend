const express = require('express')
const { signupWithEmail, sendAuthOtp, signUpWithGoogle, loginWithGoogle, getUser, logout, loginWithEmail } = require('../controllers/userController')
const { tokenValidator } = require('../middleware/tokenValidator')
const router = express.Router()

router.get('/auth', tokenValidator, getUser)
router.post('/signup-with-email', signupWithEmail)
router.post('/signup-with-google', signUpWithGoogle)
router.post('/send-auth-otp', sendAuthOtp)
router.post('/login-with-google', loginWithGoogle)
router.post('/login-with-email', loginWithEmail)
router.post('/forgot-password', loginWithEmail)
router.get('/logout', logout)

module.exports = router