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
    const data = await db.collection("Bills").find({}).toArray((err,res)=>{
        if(err) throw err;
        return res;
    });
    return res.status(200).json({ message: "Bills Received", data: data});
  }else if(req.method==="POST"){
    const {items, date, total, mode}=req.body;

    await db.collection("Bills").insertOne({date:date, items:items, total:total,mode:mode, entryBy:username},(err,res)=>{
        if(err) throw err
        return res
    })

    const inventoryUpdate = await Promise.all(
        items.map((item) => {
          return db
            .collection("Inventory")
            .updateOne(
              { name: item.name },
              { $inc: { quantity: Number(item.quantity)*-1 } },
              { upsert: true },
              (err, res) => {
                if (err) throw err;
                return res;
              }
            );
        })
      );

    return res.status(200).json({message:"Billing Successful"})
  }
  else return res.status(401).json({ message: "Unauthorized Method" });
}
