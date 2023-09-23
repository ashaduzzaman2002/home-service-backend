const express = require('express')
const { signupWithEmail, sendAuthOtp, signUpWithGoogle, loginWithGoogle, getUser, logout, loginWithEmail, forgotPassword } = require('../controllers/userController')
const { tokenValidator } = require('../middleware/tokenValidator')
const router = express.Router()

router.get('/auth', tokenValidator, getUser)
router.post('/signup-with-email', signupWithEmail)
router.post('/signup-with-google', signUpWithGoogle)
router.post('/send-auth-otp', sendAuthOtp)
router.post('/login-with-google', loginWithGoogle)
router.post('/login-with-email', loginWithEmail)
router.put('/forgot-password', forgotPassword)
router.get('/logout', logout)

// Hello

module.exports = router