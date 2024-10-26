
import { NextFunction, Response, Request } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwt = jsonwebtoken;

type thisController = ( req: Request, res: Response ,next:NextFunction)=>void

export const authChecker:thisController = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.toString().startsWith("Booyaba")) {
    return res.end("Invalid credentials provided by request client");
  }

  const authToken = authorization.toString().split(" ")[1];

  const payload = jwt.verify(authToken, process.env.JWT_ASHIRI as string);

  // @ts-expect-error user is not a property of type request object but I'm adding it for authentication sake
  req.user = payload.userId;
  next();
};
