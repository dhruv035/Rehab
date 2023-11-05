import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { verifyToken } from "../../../frontend-services/auth";
import { NavBar } from "@/components/Navbar/NavBar";
import { getPurchase,updatePurchase } from "@/frontend-services/purchases";
import { useToast } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [accessToken, setAccessToken] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [purchase, setPurchase] = useState({});
  const [newPrice, setNewPrice] = useState("");
  const [newQuant, setNewQuant] = useState("");
  const toast = useToast();
  const router = useRouter();
  const initialise = async () => {
    let status = 0;
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
    fetchPurchase();
  }, [accessToken,router]);

  const fetchPurchase = async () => {
    if(!router.query.id)
    return;
    const data = await getPurchase(accessToken, router.query.id);
    if (data.status === 200) {
      const res = await data.json();
      console.log("ABC", res.data);
      setPurchase(res.data);
    }
  };
  const updateToDB = async () => {
    const data = await updatePurchase(accessToken,router.query.id,purchase.items[updateIndex].name,{newPrice,newQuant})
    if(data.status===200)
    {
      const inner=await data.json();
      console.log("INNER",inner)
      toast({
        title: 'Success ',
        description: inner.message,
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      fetchPurchase();
      await fetchPurchase();
      setIsUpdate(false);
      setUpdateIndex(-1);
    }
    else{
      toast({
        title: 'Failure ',
        description: data.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
    
  };
  console.log("Query", router.query.id);
  console.log("Purchase", purchase);
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex flex-col my-4 bg-gray-200 self-center items-center p-[3.5vw] md:p-4 max-w-[100%] rounded-[10px]">
        <p className="font-bold text-[5.5vw] md:text-[24px] text-center text-amber-800">
          Order Details
        </p>
        <div className="flex flex-col items-start max-w-[100%]">
        <div className="flex flex-row max-w-[100%] font-bold justify-center self-start text-[3.2vw] md:text-[16px] mt-4 ">
          <p className="mr-[2vw] md:mr-10 w-[12vw]">Item Name</p>{" "}
          <p className="w-[14vw] mr-1">Price</p>
          <p className="w-[14vw] mr-1">Qty</p>
          <p className="w-[14vw] mr-1">Amount</p>
        </div>
        {purchase?.items?.length > 0 &&
          purchase.items.map((item, index) => {
            if (index !== updateIndex)
              return (
                <div key={index} className=" my-4 max-w-[100%] text-[3vw] md:text-[14px] flex flex-row justify-center">
                  <p className="mr-[2vw] md:mr-10 w-[12vw]">{item.name}</p>
                  <p className="w-[14vw] mr-1">{item.price}</p>
                  <p className="w-[14vw] mr-1">{item.quantity}</p>
                  <p className="w-[14vw] mr-1">{item.amount}</p>
                  <button
                    className="bg-blue-500 p-2 rounded-[20px] md:text-16px text-[2vw] w-[14vw] md:w-[10vw]"
                    onClick={() => {
                      setIsUpdate(true);
                      setUpdateIndex(index);
                      setNewPrice(item.price);
                      setNewQuant(item.quantity);
                    }}
                  >
                    Update
                  </button>
                </div>
              );
            else
              return (
                <div
                  key={index}
                  className=" my-4 flex border-[1px] border-blue-600 items-center bg-white py-2 px-[2vw] md:px-4 rounded-[10px] w-full justify-center"
                >
                 <table>
                  <thead className="text-[3vw] text-left font-bold md:text-[18px]">
                  <tr>
                    <th>
                      Name
                    </th>
                    <th>
                      Price
                    </th>
                    <th>
                      Qty
                    </th>
                    <th>
                      Amount
                    </th>
                  </tr>
                  </thead>
                  <tbody className="text-[2.5vw]  md:text-[16px] text-left">
                    <tr>
                      <th className="pr-[2vw]">{item.name}</th>
                      <th>
                      <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.currentTarget.value)}
                      className="border-1 bg-gray-100  mr-[2vw] p-[1vw] w-[10vw]"
                    />
                      </th>
                      <th>
                      <input
                      type="number"
                      value={newQuant}
                      onChange={(e) => setNewQuant(e.currentTarget.value)}
                      className="border-1 bg-gray-100 mr-[2vw] p-[1vw] w-[8vw]"
                    />
                      </th>
                      <th>
                      {newPrice * newQuant}
                      </th>
                    </tr>
                  </tbody>
                 </table>
                 {/*<div>
                  <div className="flex flex-col">
                    <p>
                      <sup className="">Name</sup>
                    </p>
                    <p className="mr-[3vw] md:mr-10 w-[6vw] max-w-full">{item.name}</p>
                  </div>
                  <div className="flex flex-col mx-[1vw] md:mx-2">
                    <p>
                      <sup className="">Price</sup>
                    </p>
                    <input
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.currentTarget.value)}
                      className="border-1 bg-gray-100 p-2 w-[12vw]"
                    />
                  </div>
                  <div className="flex flex-col mx-2">
                    <p>
                      <sup className="">Qty</sup>
                    </p>
                    <input
                      value={newQuant}
                      onChange={(e) => setNewQuant(e.currentTarget.value)}
                      className="border-1 bg-gray-100 p-2 w-[10vw]"
                    />
                  </div>
                  <div>
                    <p>
                      <sup className="p-2">Amount</sup>
                    </p>
                    <p className="w-[12vw] text-[3.5vw] md:text-[16px] md:w-[100px] p-2">{newPrice * newQuant}</p>
                  </div>
                   */}
                   <div className="flex flex-row px-[2vw] text-[3vw] md:text-16px">
                  <button
                    className="mr-[2vw] md:mr-4 h-max=w-[14vw] p-2 rounded-[20px] bg-green-500"
                    onClick={() => {
                      updateToDB();
                    
                    }}
                  >
                    Update
                  </button>
                  
                  <button
                    className=" w-[14vw] p-2 rounded-[20px] bg-gray-500"
                    onClick={() => {
                      setIsUpdate(false);
                      setUpdateIndex(-1);
                    }}
                  >
                    Cancel
                  </button>
                  </div>
                </div>
              );
          })}
        <div className="mt-6 self-end text-[3vw] md:text-[16px] mr-[2vw] md:mr-14 text-black font-bold
       md:w-[120px] h-[50px]">
          Total: {purchase.total}
        </div>
        </div>
      </div>
    </div>
  );
}
