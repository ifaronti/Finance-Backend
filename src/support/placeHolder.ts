import { PrismaClient } from "@prisma/client";
import * as placeholderData from '../data.json'

const prisma = new PrismaClient()

export async function populateUserData(userId: number) {
    const placeHolderTransactions = placeholderData.transactions.map((item) => {
        item.userId = Number(userId);
        return item;
      });
    
      const placeHolderBudgets = placeholderData.budgets.map((item) => {
        item.userId = Number(userId);
        return item;
      });
    
      const placeHolderPots = placeholderData.pots.map((item) => {
        item.userId = Number(userId);
        return item;
      });
    
      const placeHolderBills = placeholderData.recurringBills.map((item) => {
        item.userId = Number(userId);
        return item;
      });
    
      await prisma.transactions.createMany({ data: placeHolderTransactions });
      await prisma.pot.createMany({ data: placeHolderPots });
      await prisma.budget.createMany({ data: placeHolderBudgets });
      await prisma.bills.createMany({ data: placeHolderBills });
}