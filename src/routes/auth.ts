import express from 'express'
import { Register } from '../controller/auth/signup.controller'
import { Login } from '../controller/auth/login.controller'
import { Logout } from '../controller/auth/logout.controller'
import { oAuthLogin } from '../controller/auth/oauth.controller'

const authRouter = express.Router()

authRouter.route('/register').post(Register)
authRouter.route('/login').post(Login).get(oAuthLogin)
authRouter.route('/logout').delete(Logout)

export default authRouter