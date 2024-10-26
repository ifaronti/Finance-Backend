import express from 'express'
import { Login, Register } from '../controller/auth/auth.controller'

const router = express.Router()

router.route('/register').post(Register)
router.route('/login').post(Login )

export default router