import express from 'express'
import { Register } from '../controller/auth/signup.controller'
import { Login } from '../controller/auth/login.controller'
import { Logout } from '../controller/auth/logout.controller'

const authRouter = express.Router()

authRouter.route('/register').post(Register)
authRouter.route('/login').post(Login)
export const logout =authRouter.route('/logout').delete(Logout)

export default authRouter