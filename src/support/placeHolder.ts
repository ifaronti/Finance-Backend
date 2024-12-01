import { PrismaClient } from "@prisma/client";
import * as placeholderData from '../data.json'

const prisma = new PrismaClient()

export async function populateUserData(userId: string) {
    const placeHolderTransactions = placeholderData.transactions.map((item) => {
        item.userId =String(userId);
        return item;
      });
    
      const placeHolderBudgets = placeholderData.budgets.map((item) => {
        item.userId =String(userId);
        return item;
      });
    
      const placeHolderPots = placeholderData.pots.map((item) => {
        item.userId =String(userId);
        return item;
      });
    
      const placeHolderBills = placeholderData.recurringBills.map((item) => {
        item.userId = String(userId);
        return item;
      });
    
      await prisma.transactions.createMany({ data: placeHolderTransactions });
      await prisma.pots.createMany({ data: placeHolderPots });
      await prisma.budgets.createMany({ data: placeHolderBudgets });
      await prisma.bills.createMany({ data: placeHolderBills });
}