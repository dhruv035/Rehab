import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getRates } from "@/frontend-services/rates";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

const menu = {
  Rates: "/rates",
  Purchases: "/history",
  Dashboard: "/dashboard",
};
export const NavBar = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row bg-amber-400 w-full h-[70px] justify-center items-center">
        {Object.keys(menu).map((item, index) => {
          return (
            <div
              key={index}
              className="px-4 hover:cursor-pointer border-r-[1px] border-black"
              onClick={() => {
                router.push(menu[item]);
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </>
  );
};
