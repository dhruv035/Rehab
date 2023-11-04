import clientPromise from "@/backend-services/database";
import { getToken, verifyPassword } from "@/backend-services/auth";
export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).send("OK");
  if (req.method !== "POST")
    return res.status(401).json({ message: "Unauthorized Method" });
  const client = await clientPromise;
  const db = await client.db("Bar");
  const { username, password } = req.body;
  const user = await db
    .collection("User")
    .findOne({ username: username }, (err, res) => {
      if (err) throw err;
      return res;
    });
    if(!user.enabled)
    {
        return res.status(401).json({message:"User not verified"})
    }
    const data = verifyPassword(user,password)
    console.log("DATA",data)
  if (!verifyPassword(user, password))
    return res.status(401).json({ message: "Authentication Failed" });
  const accessToken = getToken({ username: username });
  return res.status(200).json({ message: "Authenticated", token: accessToken });
}
