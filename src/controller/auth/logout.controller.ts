import { controller } from "./signup.controller";

export const Logout: controller = async (req, res) => {

    res.send('user successfully logged out')
};