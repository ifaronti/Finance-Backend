import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const jwt = jsonwebtoken;

export type controller = (  req: Request, res:Response)=>void

type authBody = {
  email: string;
  name: string;
  password: string;
  income: number;
  avatar: string;
  expenses: number;
  balance: number;
};

type loginBody = {
  email: string;
  password: string;
};

export const Register:controller = async (req, res) => {
  const { email, name, password, income, avatar, expenses, balance }: authBody =
    req.body;
  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email: email,
      income: income,
      avatar: avatar,
      name: name,
      password: hashed,
      expenses: expenses,
      balance: balance,
    },
  });
  return res.send(user);
};

export const Login:controller = async (req, res) => {
  const { email, password }: loginBody = req.body;
  if (!email || !password) {
    console.log('no emai');
    
    return res.end("Username and password are required");
  }

  const user = await prisma.user.findFirst({ where: { email: email } });
  if (!user) {
    console.log('user not found');
    res.end('User not found')
  }
  
  const isMatch = await bcryptjs.compare(password, user?.password as string);
  if (!isMatch) {
    return res.end("Invalid login credentials provided");
  }

  const token = jwt.sign({ user: user?.email, userId:user?.id }, process.env.JWT_ASHIRI as string, {
    expiresIn: "1d",
  });

  return res.status(200).json({ success: true, accessToken: token });
};

export const Logout:controller = async (req: Request, res: Response) => {
  return res.send("logged out");
};
