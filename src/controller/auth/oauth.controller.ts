import { PrismaClient } from '@prisma/client'
import { controller } from './signup.controller'
import { config } from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import { populateUserData } from '../../support/placeHolder'
import { getGithubUserData } from '../../support/githubAuthProvider'

config()

const prisma = new PrismaClient()
const jwt = jsonwebtoken

type userData = {
    id: number
    email: string
    name: string
    avatar_url:string
}

export const oAuthLogin:controller = async(req, res) => {
    const { code } = req.query
    try {
        const data:userData = await getGithubUserData(String(code))
        let user = await prisma.user.findFirst({ where: { email: data.email } })

        if (user?.id && user?.email !== data.email) {
           await prisma.user.update({data: {email:String(data.email)}, where:{id:user.id}})
        } 
        
        if (!user?.id) {
        user = await prisma.user.create({
            data: {
                githubID:data.id,
                email: data.email,
                name: data.name,
                avatar: '.'+data.avatar_url,
                balance: 5000,
                income:5000
            }
        })
            await populateUserData(user.id)
        }
        const accessToken = jwt.sign({user:user.email, userId:user.id}, String(process.env.JWT_ASHIRI))
        
        return res.status(200).json({ success: true, accessToken: accessToken })
    }
    catch (err) {
        //@ts-expect-error err type unknown
        res.send(err.message);
    }
}

// let user = await prisma.user.upsert({
//     where:{email:data.email},
//     update: {
//        email:data.email
//     },
//     create: {
//         githubID:data.id,
//         email: data.email,
//         name: data.name,
//         avatar: '.'+data.avatar_url,
//         balance: 5000,
//         income:5000
//     }
// })  