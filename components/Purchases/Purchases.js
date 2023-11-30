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
          <table className="self-start">
            <thead className="text-[3.5vw] text-center font-bold md:text-[18px]">
              <tr>
                <th className={trunc===true?"w-[22vw]":"w-[20vw]"}>Date</th>
                <th className={trunc===true?"w-[22vw]":"w-[20vw]"}>Amount</th>
                {trunc!==true&&<th className="w-[22vw]">Items</th>}
                <th className={trunc===true?"w-[22vw]":"w-[20vw]"}>Entry By</th>
              </tr>
            </thead>
            <tbody className="text-[3vw]  md:text-[16px] text-left">
              {trunc !== true ? (
                purchases.map((item, index) => {
                  return (
                    <tr key={index} className="text-center">
                      <th>{item.date}</th>
                      <th>{item.total}</th>
                      <th className="py-[4vw]">
                        {item.items.map((data, index) => {
                          return (
                            <div key={index}>
                              <p className="font-bold align-text-bottom">
                                {data.name + ":-"}
                              </p>
                              <p className="text-[2vw] align-text-bottom md:text-[12px]">
                                {"Rs." + data.amount}
                              </p>
                            </div>
                          );
                        })}
                      </th>
                      <th>{item.createdBy}</th>
                    </tr>
                  );
                })
              ) : (
                purchases.slice(0,3).map((item,index)=>{
                  return(
                    <tr key={index} className="text-center">
                      <th className="pr-[2vw]">{item.date}</th>
                      <th className="">{item.total}</th>
                      <th className="">{item.createdBy}</th>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        "No Purchases"
      )}
    </div>
  );
};
