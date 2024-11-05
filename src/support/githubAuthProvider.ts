import axios from "axios";
import qs from 'qs'
import { config } from "dotenv";
config()

export async function getGithubUserData(code: string) {
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const gitURL = "https://github.com/login/oauth/access_token?"
    
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
    
    return data
}