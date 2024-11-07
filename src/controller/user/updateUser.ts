import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()
const bcrypt = bcryptjs

type userData = {
    name?: string
    email?: string
    avatar?: string
    income?: number
    password?:string
}

export const updateUser:controller = async (req, res) => {
    const { name, email, avatar, income, password } = req.body

    //@ts-expect-error auth middleware
    const userId = req.user
    
    const newUserData: userData = {}
    let newPassword = ''

    if (password && password !== undefined) {
        const salt = await bcrypt.genSalt(10)
        newPassword = await bcrypt.hash(password, salt)
        newUserData.password = newPassword
    }

    if (name && name !== undefined) {
        newUserData.name = name
    }

    if (email && email !== undefined) {
        newUserData.email = email
    }

    if (avatar && avatar !== undefined) {
        newUserData.avatar = avatar
    }

    if (income && income !== undefined && income !== 0) {
        newUserData.income = Number(income)
    }

    const updatedUser = await prisma.user.update({
        where: {
            id:userId
        },
        data:newUserData
    })

    if (!updatedUser.id) {
       return res.send('An error has occured; user not updated. Please try again')
    }

    return res.status(200).json({success:true, message:'User details updated successfully'})
}