import Image from "next/image";
import { Inter } from "next/font/google";
import { SettingsIcon } from "@chakra-ui/icons";

const inter = Inter({ subsets: ["latin"] });

export const Rates = ({ rates }) => {
  console.log("RATES", rates);
  return (
    <div className="flex max-w-[100%] flex-col items-center">
      {rates?.length > 0 ? (
        <div className="flex flex-col p-2 mx-2 w-[90%] my-16 md:my-2 bg-gray-400 items-center rounded-[10px]">
          <div className="flex flex-row-reverse w-[90%]">
          <div className="">
              <SettingsIcon
                className="border-1 mx-4 rounded-[5px] mt-4 w-[100px] hover:cursor-pointer"
                boxSize={3}
                onClick={() => {
                  
                }}
              />
            </div>{" "}
            
          </div>
          <p className="text-[30px] text-black mb-8 md:mb-2 font-bold">Rate List</p>
          <div className="flex flex-row font-bold text-[20px] mb-4 text-center">
            <p className="mr-4 w-[30vw] md:w-[14vw]">Item</p>{" "}
            <p className="mr-4 w-[30vw] md:w-[14vw]">Price</p>
          </div>
          {rates.map((item, index) => {
            return (
              <div key={index} className="flex flex-row my-4 md:my-2 text-center">
                <div className="w-[30vw] md:w-[14vw] mr-4">{item.name}</div>
                <div className="w-[30vw] md:w-[14vw] mr-4">{item.price}</div>
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
