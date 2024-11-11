import { PrismaClient } from "@prisma/client";
import { controller } from "./signup.controller";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const jwt = jsonwebtoken;

type loginBody = {
    email: string;
    password: string;
};

export const Login: controller = async (req, res) => {
    const { email, password }: loginBody = req.body;

    if (!email || !password) {  
      return res.end("Username and password are required");
    }
  
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (!user?.id) {
      res.end('User not found')
    }
    
    const isMatch = await bcryptjs.compare(password, user?.password as string);
    if (!isMatch) {
      return res.end("Invalid login credentials provided");
    }
  
    const token = jwt.sign({ user: user?.email, userId:user?.id }, process.env.JWT_ASHIRI as string, {
      expiresIn: "1d",
    });
  
    return res.status(200).json({ success: true, accessToken: token, name:user?.name });
  };