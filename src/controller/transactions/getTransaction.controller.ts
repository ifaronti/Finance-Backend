import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";
import { sortResponse } from "../../support/sort";

const prisma = new PrismaClient();

type catQuery = {
  userId: string;
  category: string;
  name?: { contains: string, mode: 'insensitive' }
  recurring?:boolean
};

export const transactions:controller = async (req, res) => {
  const { skip, sort, category, name } = req.query;
  //@ts-expect-error from middleware function 
  const query: catQuery = { userId: req.user };

  if (category && category !=='' && category !=="All Transactions" && category !==undefined){
    query.category = category.toString();
  }
  
  if (name && name !==undefined && name !==null && name !=='') {
    query.name = { contains: name?.toString(), mode: 'insensitive' }
  }
  const order = sortResponse(String(sort))
  
  try {
    const transactions = await prisma.transactions.findMany({
      where: { ...query },
      skip: Number(skip),
      take: 10,
      orderBy: order,
    });
    
    if (!transactions[0]) {
      return res.end('User error, please try again')
    }

    const lastPage = {
      isLastPage:transactions.length<10?true:false
    }
  
    return res.status(200).json({ success: true, data: transactions, ...lastPage });
  }
  
  catch (err) {
    //@ts-expect-error won't accept any type 
    res.send(err.message)
  }
};  