import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";
import { sortResponse } from "../../support/sort";
import { getLastDayOfMonth } from "../../support/lastDay";

const prisma = new PrismaClient();

type bill = {
  billId: number
  name: string            
  amount:number        
  category:string        
  isPlaceholder:boolean 
  avatar:string         
  due_day:number         
  categoryId:number     
  updatedAt:string      
  createdAt:string       
}

export const getBills: controller = async (req, res) => {
  const { skip, name, sort } = req.query;
  // @ts-expect-error authorization middleware
  const userId = req.user;
  const today = new Date().getDay() + 1;
  const lastDay = getLastDayOfMonth();
  const order = sortResponse(String(sort), "createdAt");
  const sanitizedName = name ? String(name).replace(/[^a-zA-Z0-9 ]/g, '') : ''
  
  let query = `
    WITH bill_day AS (
        SELECT
            CASE
                WHEN (b.due_day <= $1) THEN 'paid'
                WHEN (b.due_day > $1) AND (b.due_day - $1 < 7) THEN 'soon'
                WHEN (b.due_day > $1) AND (b.due_day - $1 > 7) THEN 'upcoming'
                WHEN ($2 = $1) AND (b.due_day < 7) THEN 'soon'
                ELSE 'upcoming'
            END AS status,
            b.name,
            b.amount,
            b.avatar,
            b.due_day,
            b."billId",
            b.category,
            b."categoryId",
            b."userId",
            b."createdAt"
        FROM bills b
    )
    SELECT * 
    FROM bill_day
    WHERE bill_day."userId" = $3`;
  
  const params = [today, lastDay, userId, order, Number(skip)];

  if (sanitizedName && sanitizedName !== '') {
      query += ` AND POSITION(LOWER($6) IN LOWER(bill_day.name)) > 0`;
      params.push(sanitizedName);
  } else {
    // //
  }
  
  const bills: bill[] = await prisma.$queryRawUnsafe(query, ...params);
  
  if (!bills[0]) {
    return res.end("No bills available for user");
  }
  const isLastPage = bills.length < 10 ? true : false;

  return res.status(200).json({ success: true, data: bills, isLastPage});
};