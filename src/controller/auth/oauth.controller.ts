import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import { controller } from './signup.controller'
import { config } from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import { populateUserData } from '../../support/placeHolder'
import qs from 'qs'

config()

const prisma = new PrismaClient()
const jwt = jsonwebtoken

export const oAuthLogin:controller = async(req, res) => {
    const { code } = req.query
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const gitURL = "https://github.com/login/oauth/access_token?"

    try {
        const token = await axios.post(
        gitURL + 'client_id=' + clientId + '&client_secret=' + clientSecret + '&code=' + code, {
            headers:{"Content-Type": "application/json"}
        }).then(res => res.data)

       const {access_token} = qs.parse(token)

        const {data} = await axios.get("https://api.github.com/user",
            {headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type":'application/json'
                    },
            }
        )
        let user = await prisma.user.findFirst({ where: { id: data.id } })
        
        if (!user?.id) {
        user = await prisma.user.create({
                data: {
                    id:data.id,
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
        console.log(err.message);
    }
}