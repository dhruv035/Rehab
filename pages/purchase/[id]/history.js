import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { verifyToken } from "../../../frontend-services/auth";
import { NavBar } from "@/components/Navbar/NavBar";
import { getPurchase,updatePurchase } from "@/frontend-services/purchases";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [accessToken, setAccessToken] = useState("");
  
  const router = useRouter();
  const initialise = async () => {
   
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    if (token.length) {
        console.log("TRYING THIS",token)
      const checkData = await verifyToken(token);
      console.log("CHECKEDDATA",checkData,checkData.status)
      if (checkData.status === 200) {
        setAccessToken(token);
        console.log("HEREAA")
      } else {
        router.push("/");
      }
    } else router.push("/");
  };

  useEffect(() => {
    initialise();
  }, []);

  useEffect(() => {
    if (!accessToken||!router.query.id) return;
    
  }, [accessToken,router]);

  
  return (
    <div className="flex flex-col">
      <NavBar/>
      <div className="flex flex-col my-4 bg-gray-200 self-center items-center p-[3.5vw] md:p-4 max-w-[100%] rounded-[10px]">
      </div>
    </div>
  );
}
