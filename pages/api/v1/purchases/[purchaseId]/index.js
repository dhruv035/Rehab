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
  const { username } = validity.payload;
  const client = await clientPromise;
  const db = await client.db("Bar");
  const { purchaseId } = req.query;
  const object = new ObjectId(purchaseId);
  if (req.method === "GET") {
    console.log("ID", purchaseId, req.query);

    const data = await db.collection("Purchase").findOne({ _id: object });
    if (!data) res.status(200).json({ message: "NotFound" });
    return res.status(200).json({ message: "Data Received", data: data });
  } else if (req.method === "PUT") {
    const { item, name } = req.body;
    const dat = await db.collection("Purchase").findOne({ _id: object });
    const toUpdate = dat.items.filter((element) => {
      console.log
      return element.name === name;
    });
    const updateData=toUpdate[0]
    delete updateData.history;
    delete updateData.createdBy;
    const difference = (item.newQuant*item.newPrice)-updateData.amount;
    const date = new Date();
    const timestamp = date.getTime();
    updateData.newPrice=item.newPrice;
    updateData.newQuant=item.newQuant;
    updateData.newAmount=item.newPrice*item.newQuant;
    updateData.timestamp=Math.floor(timestamp/1000);
    updateData.editedBy=username;
    
    const data = await db.collection("Purchase").updateOne(
      { _id: object },
      {
        $set: {
          "total":dat.total+difference,
          "items.$[elem].quantity": item.newQuant,
          "items.$[elem].price": item.newPrice,
          "items.$[elem].amount": item.newQuant * item.newPrice,
          "items.$[elem].editedBy": username,
        },
        $push: {
          "items.$[elem].history": updateData,
        },
      },
      { arrayFilters: [{ "elem.name": name }] }
    );
    console.log("DATA", data);
    return res.status(200).json({ message: "Updated" });
  } else return res.status(401).json({ message: "Unauthorized Method" });
}
