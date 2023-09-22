const express = require('express')
const { signupWithEmail, sendAuthOtp, signUpWithGoogle } = require('../controllers/userController')
const router = express.Router()

router.get('/', (req,res) => res.json('Hello users'))
router.post('/signup-with-email', signupWithEmail)
router.post('/signup-with-google', signUpWithGoogle)
router.post('/send-auth-otp', sendAuthOtp)

module.exports = router