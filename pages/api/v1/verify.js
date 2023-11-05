import clientPromise from "@/backend-services/database";
import { getAuthToken, verifyToken } from "@/backend-services/auth";
export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).send("OK");
  if(!req.method==="GET") return res.status(401).json({message:"Unauthorized Method"})
  const token = await getAuthToken(req);
  const validity = verifyToken(token);
  if (!validity.authorized)
    return res.status(401).json({ message: validity.message });
  console.log(validity);
  return res.status(200).json({message:"Verified"});
  
}
