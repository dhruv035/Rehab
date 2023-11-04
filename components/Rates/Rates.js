import Image from "next/image";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export const Rates = ({ rates }) => {
    console.log("RATES",rates)
  return (
    <div>
      {rates?.length > 0 ? (
        <div className="flex flex-col p-2 mx-2 my-2 bg-gray-400 items-center  rounded-[10px]">
            <div className="text-[30px] text-black font-bold">Rate List</div>
            <div className="flex flex-row font-bold text-[20px] text-center">
            <p className="mr-4 w-[10vw]">Item</p> <p className="mr-4 w-[10vw]">Price</p>
            </div>
          {rates.map((item, index) => {
            return (
              <div key={index} className="flex flex-row my-2 text-center">
                <div className="w-[10vw] mr-4">{item.name}</div>
                <div className="w-[10vw] mr-4">{item.price}</div>
                
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
