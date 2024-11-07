import { Router } from "express";
import { updateUser } from "../controller/user/updateUser";
import { deleteUser } from "../controller/user/deleteUser";

const userRouter = Router()

userRouter.route('/user').patch(updateUser).delete(deleteUser)

export default userRouter