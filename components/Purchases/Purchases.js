import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getRates } from "@/frontend-services/rates";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export const Purchases = ({ purchases, trunc, fullWidth }) => {
  console.log("PURCHASES2", purchases);
  const router = useRouter();

  const handlePurchase = (index) => {
    router.replace("/purchase/" + purchases[index]._id);
  };
  return (
    <div className="flex justify-center">
      {purchases?.length > 0 ? (
        <div className="flex flex-col py-2 px-4 mx-2 my-2 bg-gray-400  items-center self-center rounded-[10px] w-[90%]">
          <div className=" text-[5.5vw] md:text-[30px] text-black text-center font-bold">
            Purchase Orders
          </div>
          <div className="flex max-w-[95%] flex-row p-2 font-bold text-[3vw] md:text-[20px] text-start self-start">
            <p className="mr-2 md:mr-4 w-[20vw] md:w-[14vw]">Date</p>
            <p className="mr-2 md:mr-4 w-[20vw] md:w-[16vw]">Amount</p>
            {trunc !== true && <p className="mr-2 md:mr-4 w-[20vw] md:w-[14vw]">Items</p>}
            <p className="mr-2 md:mr-4 w-[20vw] md:w-[14vw]">Entry By</p>
          </div>
          {trunc !== true
            ? purchases.map((item, index) => {
                console.log("HEREE");
                return (
                  <div
                    key={index}
                    onClick={() => handlePurchase(index)}
                    className=" max-w-[95%] rounded-[15px] flex flex-row my-2 p-2 hover:cursor-pointer text-start bg-white border-[1px] border-blue-800 hover:bg-gray-100"
                  >
                    <div className="w-[20vw] md:w-[14vw] text-[2.5vw] md:text-[16px] mr-2 md:mr-4">
                      {item.date}
                    </div>
                    <div className="w-[20vw] md:w-[16vw] text-[2.5vw] md:text-[16px] mr-2 md:mr-4">
                      {item.total}
                    </div>
                    <div className="  ">
                      {item.items.map((data, index) => {
                        console.log("DATAAA", data, index);
                        return (
                          <div key={index} className="w-[20vw] md:w-[14vw] text-[2.5vw] flex items-baseline flex-col mr-2 md:text-[16px] md:mr-4 md:flex-row ">
                            <p  className="font-bold align-text-bottom">
                              {data.name + ":-"}
                            </p>
                            <p  className="text-[2vw] align-text-bottom md:text-[12px]">
                              {"Rs." + data.amount}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-[20vw] md:w-[14vw] mr-2 md:mr-4 text-[2vw] md:text-[12px]">{item.entryBy}<br></br><p className="underline bold w-[14vw] text-blue-950">
                      View Details
                    </p></div>
                  </div>
                );
              })
            : purchases.slice(0, 3).map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handlePurchase(index)}
                    className=" w-full rounded-[15px] p-2 flex flex-row my-2 md:text-[16px] text-[3.5vw] text-start hover:cursor-pointer hover:bg-gray-100"
                  >
                    <div className="w-[16vw] md:w-[12vw] mr-2 md:mr-4">
                      {item.date}
                    </div>
                    <div className="w-[18vw] md:w-[12vw] mr-2 md:mr-4">
                      {item.total}
                    </div>
                    <div className="w-[16vw] md:w-[12vw] mr-2 md:mr-4">
                      {item.entryBy}
                    </div>
                    <div className="underline bold w-[14vw] text-blue-950">
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
