import clientPromise from "@/backend-services/database"
import {getPasswordHash} from "@/backend-services/auth"
export default async function handler(req, res) {
    if(req.method==="OPTIONS")
    return res.status(200).send("OK");
    if(req.method!=="POST")
    return res.status(401).json({ message: 'Unauthorized Method' })
    const client = await clientPromise;
    const {username,password} = req.body;
    const db = await client.db("Bar")
    const {hash,salt}= getPasswordHash(password);
    const data = await db.collection("User").insertOne({username:username,hash:hash,salt:salt,enabled:false},(err,res)=>{
        if(err)throw err
    })
    return res.status(200).json({message:"User Created"})
  }
  