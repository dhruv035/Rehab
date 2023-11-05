import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getRates } from "@/frontend-services/rates";
import { AddIcon, Icon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import {FiLogOut} from "react-icons/fi"
const inter = Inter({ subsets: ["latin"] });

const menu = {
  Dashboard: "/dashboard",
  Rates: "/rates",
  Purchases: "/history",
  
};
export const NavBar = () => {

  
  const router = useRouter();

  const handleLogout=()=>{
    localStorage.setItem("accessToken","")
    router.replace("/")
  }
  return (
  
      <div className="flex flex-row bg-amber-400 w-[100%] h-[10vh] justify-center items-center">
        <div className="flex flex-row w-full justify-center">
        {Object.keys(menu).map((item, index) => {
          return (
            <div
              key={index}
              className="px-[2vw] hover:cursor-pointer border-r-[1px] border-black font-bold text-[4.5vw] md:text-[40px]"
              onClick={() => {
                router.push(menu[item]);
              }}
            >
              {item}
            </div>
          );
        })}</div>
        <div className="flex justify-self-end right w-fit mr-[2vw]"><Icon boxSize={"4vw"} onClick={()=>{handleLogout()}} as={FiLogOut}></Icon></div>
      </div>
    
  );
};
