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
  const { purchaseId } = req.query;
  const object = new ObjectId(purchaseId);
  if (req.method === "GET") {
    console.log("ID", purchaseId, req.query);

    const data = await db.collection("Purchase").findOne({ _id: object });
    console.log("DATA", data);
    if (!data) res.status(200).json({ message: "NotFound" });
    return res.status(200).json({ message: "History Received", data: data.history });
  }else return res.status(401).json({ message: "Unauthorized Method" });
}
