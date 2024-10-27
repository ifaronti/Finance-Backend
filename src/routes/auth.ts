import express from 'express'
import { Register } from '../controller/auth/signup.controller'
import { Login } from '../controller/auth/login.controller'

const router = express.Router()

router.route('/register').post(Register)
router.route('/login').post(Login )

export default router