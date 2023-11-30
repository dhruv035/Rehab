import clientPromise from "@/backend-services/database";
import { getAuthToken, verifyToken } from "@/backend-services/auth";
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(200).send("OK");
  }
  const token = await getAuthToken(req);
  console.log("token", token);
  const validity = verifyToken(token);
  if (!validity.authorized)
    return res.status(401).json({ message: validity.message });
  const { username } = validity.payload;
  const client = await clientPromise;
  const db = client.db("Bar");
  if (req.method === "GET") {
    const data = await db.collection("Rates")
      .find({})
      .toArray();
      console.log("RATES",data)
    return res.status(200).json({ message: "Rates received", data: data });
  } else if (req.method === "POST") {
    const { items } = req.body;

    const update = await db.collection("Rates").insertMany(items);



   
    return res.status(200).json({ message: "Added new Items" });
  } else if (req.method === "PUT") {
    const { name, price,newName, units } = req.body;
    const update = await db
      .collection("Rates")
      .updateOne(
        { name: name },
        { $set: { price: price, entryBy: username,name:newName, units:units } },
      );
    return res.status(200).json({ message: "Price Updated" });
  } else {
    return res.status(401).json({ message: "Unauthorized Method" });
  }
}
