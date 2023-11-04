import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { createUser } from "../frontend-services/auth";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const router = useRouter();

    const handleCreate = async()=>{
       const data =await createUser(username,password);
       if(data.status===200)
      {
        localStorage.setItem("accessToken","")
        router.push("/")
      }
    }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-10">
        <p className="text-[30px]">
        Create</p>
        <div className="flex flex-col mt-6">
          <label><sup>Username</sup></label>
          <input className="border-[2px] rounded-[10px] bg-zinc-200 px-2 mb-2" value={username} placeholder="Username..." onChange={(e)=>setUsername(e.currentTarget.value)}/>
          <label><sup>Password</sup></label>
          <input type="password" className="border-[2px] rounded-[10px] bg-zinc-200 px-2 mb-2" value={password} placeholder="Password..." onChange={(e)=>setPassword(e.currentTarget.value)}/>
          <button className="bg-blue-300 rounded-[15px]"
            onClick={() => {
              handleCreate();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
