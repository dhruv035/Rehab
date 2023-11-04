import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getRates } from "@/frontend-services/rates";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export const Purchases = ({ purchases, trunc,fullWidth }) => {
  console.log("PURCHASES2", purchases);
  const router = useRouter();

  const handlePurchase = (index) => {
    router.replace("/purchase/" + purchases[index]._id);
  };
  return (
    <div className="flex w-full justify-center">
      {purchases?.length > 0 ? (
        <div className="flex flex-col py-2 px-4 mx-2 my-2 bg-gray-400 items-center self-center rounded-[10px] max-w-[80vw]"
        
        >
          <div className="text-[30px] text-black font-bold">
            Purchase Orders
          </div>
          <div className="flex flex-row p-2 font-bold text-[20px] text-start self-start">
            <p className="mr-4 w-[14vw]">Date</p>
            <p className="mr-4 w-[14vw]">Amount</p>
            {trunc!==true&&<p className="mr-4 w-[14vw]">Items</p>}
            <p className="mr-4 w-[14vw]">Entry By</p>
          </div>
          {trunc !== true
            ? purchases.map((item, index) => {
                console.log("HEREE")
                return (
                  <div
                    key={index}
                    onClick={() => handlePurchase(index)}
                    className=" w-full rounded-[15px] flex flex-row my-2 p-2 hover:cursor-pointer text-start bg-white border-[1px] border-blue-800 hover:bg-gray-100"
                  >
                    <div className="w-[14vw] mr-4">{item.date}</div>
                    <div className="w-[14vw] mr-4">{item.total}</div>
                    <div className="w-[14vw] mr-4">{item.items.map((data,index)=>{
                        console.log("DATAAA",data,index)
                        return (<p key={index}>{data.name+"(@"+data.amount+")"}</p>)
                    })}</div>
                     <div className="w-[14vw] mr-4">{item.entryBy}</div>
                  </div>
                );
              })
            : purchases.slice(0, 3).map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handlePurchase(index)}
                    className=" w-full rounded-[15px] p-2 flex flex-row my-2 text-start hover:cursor-pointer hover:bg-gray-100"
                  >
                    <div className="w-[14vw] mr-4">{item.date}</div>
                    <div className="w-[14vw] mr-4">{item.total}</div>
                    <div className="w-[14vw] mr-4">{item.entryBy}</div>
                    <div className="underline bold text-blue-950">
                    View Details
                    </div>
                  </div>
                );
              })}
              
        </div>
      ) : (
        "No Purchases"
      )}
    </div>
  );
};
