import clientPromise from "@/backend-services/database";
import verifyPassowrd from "@/backend-services/auth";
import { getToken, getAuthToken, verifyToken } from "@/backend-services/auth";
export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).json({message:"OK"});

  const token = await getAuthToken(req);
  const validity = verifyToken(token);
  console.log("vValidity", validity);
  if (!validity.authorized)
    return res.status(401).json({ message: validity.message });
  console.log(validity);
  const { username } = validity.payload;

  const client = await clientPromise;
  const db = await client.db("Bar");
  if (req.method === "POST") {
    const { items, date } = req.body;
    let total = 0;
    console.log("ITEMS",items)
    const entries = await Promise.all(items.map((item)=>{
        return new Promise(async(resolve,reject)=>{
            const data = await db.collection("Rates").findOne({name:item.name})
            console.log("DATA",data)
            total+=item.quantity*data.price;
            resolve({
                name:data.name,
                quantity:item.quantity,
                price:data.price,
                amount:item.quantity*data.price
            })
        })
    }))
    console.log("PROMISE",entries);
    const update = await db
      .collection("Purchase")
      .insertOne(
        { date: date, items: entries, entryBy: username,total:total },
        (err, res) => {
          if (err) throw err;
          return res;
        }
    );
    return res.status(200).json({ message: "Purchase Recorded" });
  }
  if (req.method === "GET") {
    const data = await db.collection("Purchase").find({}).toArray();
    console.log("DATA",data)
    if(!data)
    res.status(200).json({message:"Empty",data:[]})
    return res.status(200).json({ message: "Data Received", data: data });
  } else return res.status(401).json({ message: "Unauthorized Method" });
}
