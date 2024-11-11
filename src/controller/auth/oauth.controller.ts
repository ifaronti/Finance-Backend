import { PrismaClient } from '@prisma/client'
import { controller } from './signup.controller'
import { config } from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import { populateUserData } from '../../support/placeHolder'
import { getGithubUserData } from '../../support/githubAuthProvider'

config()

const prisma = new PrismaClient()
const jwt = jsonwebtoken

type emailData =   {
    email: string,
    primary: boolean
    verified: boolean
    visibility: string
  }

type userData = {
    login:string
    id: number
    email: string
    name: string
    avatar_url:string
}

type githubData = {
    data: userData
    userEmail:emailData[]
}

export const oAuthLogin:controller = async(req, res) => {
    const { code } = req.query
    try {
        const { data, userEmail }: githubData = await getGithubUserData(String(code))
        
        if (!data.name || !userEmail[0]) {
            return res.json({success:false, message:'Update your github name and or email'})
        }

        let user = await prisma.user.findFirst({ where: { githubID: data.id } })
        const verifiedEmail = userEmail.find(item=>item.verified)?.email

        if (user?.id && user?.email !== verifiedEmail) {
           await prisma.user.update({data: {email:String(data.email)}, where:{id:user.id}})
        } 
        
        if (!user?.id) {
        user = await prisma.user.create({
            data: {
                githubID:data.id,
                email:String(verifiedEmail),
                name: data.name,
                avatar: '.'+data.avatar_url,
                balance: 5000,
                income:5000
            }
        })
            await populateUserData(user.id)
        }
        const accessToken = jwt.sign({ user: user.email, userId: user.id }, String(process.env.JWT_ASHIRI))
        
        return res.status(200).json({ success: true, accessToken: accessToken, name:user.name })
    }

    catch (err) {
        //@ts-expect-error err type unknown
        res.json({success:false, message:err.message});
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