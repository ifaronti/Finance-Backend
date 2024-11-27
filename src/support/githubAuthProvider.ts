import axios from "axios";
import qs from 'qs'
import { config } from "dotenv";
import { Response } from "express";
config()

export async function getGithubUserData(code: string, res:Response) {
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
        
        const userEmail = await axios.get("https://api.github.com/user/emails",
            {headers:{Authorization: `Bearer ${access_token}`}}
        ).then(res=>res.data)
    
        return {data, userEmail}
    }

    catch (err) {
        res.end('Unable to fetch user information')
        //@ts-expect-error won't accept 'any' type annotation
        console.log(err.message)
    }
}