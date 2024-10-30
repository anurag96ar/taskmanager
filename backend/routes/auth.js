const { signup, login,googleLogin } = require('../controllers/userController');
const { signupValidation, loginValidation } = require('../middleware/authValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post("/gooleLogin",googleLogin)

module.exports = router;