import express from "express";
import * as data from "./data.json";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.post("/", async (req, res) => {
  await prisma.category.createMany({ data: data.categories });
  await prisma.transactions.createMany({data: data.transactions});
  await prisma.pot.createMany({ data: data.pots });
  await prisma.budget.createMany({ data: data.budgets });
  await prisma.bills.createMany({data: data.RecurringsBills})


  res.send("done");
});

app.listen(9000, () => {
  console.log("server is live now!");
});

//Above server was used to populate the database with provided practice json data.

//npx tsx index.ts to run it

 //   npm i --save-dev prisma@latest                       │
//  npm i @prisma/client@latest  
