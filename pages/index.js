import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../frontend-services/auth";
import { useToast } from "@chakra-ui/react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token.length>0) console.log("Token",token)
  }, []);

  const handleLogin = async () => {
    const data = await loginUser(username,password)
    if(data.status===200)
    {
      toast({
        title: 'Logged In',
        description: "Successfully Loggedn In",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      const object = await data.json()
      localStorage.setItem("accessToken",object.token)
      router.push("/dashboard")
    }
    else{
      const object = await data.json();
      toast({
        title: 'Login failed',
        description: object.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="mt-10">
        <p className="text-[30px]">
        Login
        </p>
        <div className="flex flex-col mt-6">
          <label><sup>Username</sup></label>
          <input className="border-[2px] rounded-[10px] bg-zinc-200 px-2 mb-2" value={username} placeholder="Username..." onChange={(e)=>setUsername(e.currentTarget.value)}/>
          <label><sup>Password</sup></label>
          <input type="password" className="border-[2px] rounded-[10px] bg-zinc-200 px-2 mb-2" value={password} placeholder="Password..." onChange={(e)=>setPassword(e.currentTarget.value)}/>
          <button className="bg-blue-300 rounded-[15px]"
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
