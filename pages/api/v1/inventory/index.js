import clientPromise from "@/backend-services/database";
import { ObjectId } from "mongodb";
import { getToken, getAuthToken, verifyToken } from "@/backend-services/auth";
export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).json({ message: "OK" });

  const token = await getAuthToken(req);
  const validity = verifyToken(token);
  console.log("vValidity", validity);
  if (!validity.authorized)
    return res.status(401).json({ message: validity.message });
  console.log(validity);
  const { username,role } = validity.payload;
  const client = await clientPromise;
  const db = await client.db("Bar");
  if (req.method === "GET") {

    const data = await db.collection("Inventory").find({}).toArray((err,res)=>{
        if(err)throw err
        return res
    });
    
    return res.status(200).json({ message: "Inventory Received", data: data });
  }else if(req.method==="PUT")
  {
    const {itemName,quantity}=req.body
    await db.collection("Inventory").updateOne({name:itemName},{$set:{quantity:quantity}},{upsert:true},(err,res)=>{
        if(err) throw err;
        return res;
    })
    return res.status(200).json({message: "Inventory Updated", data:data})
  }
  else if(req.method === "POST"){
    const {items}=req.body
    const insertOperations = await Promise.all(
        items.map((item)=>{
            return db.collection("Inventory").updateOne({name:item.name},{$set:{quantity:item.quantity}},{upsert:true},(err,res)=>{
                if(err) throw err;
                return res;
            })
        })
    )
  }
  else return res.status(401).json({ message: "Unauthorized Method" });
}
