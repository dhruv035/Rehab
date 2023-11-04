import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { verifyToken } from "../../frontend-services/auth";
import { NavBar } from "@/components/Navbar/NavBar";
import { getPurchase,updatePurchase } from "@/frontend-services/purchases";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [accessToken, setAccessToken] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [purchase, setPurchase] = useState({});
  const [newPrice, setNewPrice] = useState("");
  const [newQuant, setNewQuant] = useState("");
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
        
    }
    
  };
  console.log("Query", router.query.id);
  console.log("Purchase", purchase);
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex flex-col my-4 bg-gray-200 w-[60%] self-center items-center p-4 rounded-[10px]">
        <p className="font-bold text-[24px] text-center text-amber-800">
          Order Details
        </p>
        <div className="flex flex-col w-[80%] items-start">
        <div className="flex flex-row font-bold justify-center self-start text-[16px] mt-4 ">
          <p className="mr-10 w-[120px]">Item Name</p>{" "}
          <p className="w-[100px]">Price</p>
          <p className="w-[100px]">Quantity</p>
          <p className="w-[100px]">Amount</p>
        </div>
        {purchase?.items?.length > 0 &&
          purchase.items.map((item, index) => {
            if (index !== updateIndex)
              return (
                <div key={index} className=" my-4 flex flex-row justify-center">
                  <p className="mr-10 w-[120px]">{item.name}</p>
                  <p className="w-[100px]">{item.price}</p>
                  <p className="w-[100px]">{item.quantity}</p>
                  <p className="w-[100px]">{item.amount}</p>
                  <button
                    className="bg-blue-500 p-2 rounded-[20px] w-[150px]"
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
                  className=" my-4 flex border-[1px] border-blue-600 items-center bg-white py-2 px-4 rounded-[10px] flex-row justify-center"
                >
                  <div className="flex flex-col">
                    <p>
                      <sup className="">Name</sup>
                    </p>
                    <p className="mr-10 w-[120px]">{item.name}</p>
                  </div>
                  <div className="flex flex-col mx-2">
                    <p>
                      <sup className="p-2">Price</sup>
                    </p>
                    <input
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.currentTarget.value)}
                      className="border-1 bg-gray-100 p-2 w-[100px]"
                    />
                  </div>
                  <div className="flex flex-col mx-2">
                    <p>
                      <sup className="p-2">Quantity</sup>
                    </p>
                    <input
                      value={newQuant}
                      onChange={(e) => setNewQuant(e.currentTarget.value)}
                      className="border-1 bg-gray-100 p-2 w-[100px]"
                    />
                  </div>
                  <div>
                    <p>
                      <sup className="p-2">Amount</sup>
                    </p>
                    <p className="w-[100px] p-2">{newPrice * newQuant}</p>
                  </div>
                  <button
                    className="mr-4 w-[100px] p-2 rounded-[20px] bg-green-500"
                    onClick={() => {
                      updateToDB();
                    
                    }}
                  >
                    Update
                  </button>
                  <button
                    className=" w-[100px] p-2 rounded-[20px] bg-gray-500"
                    onClick={() => {
                      setIsUpdate(false);
                      setUpdateIndex(-1);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              );
          })}
        <div className="mt-6 self-end mr-14 text-black font-bold w-[120px] h-[50px]">
          Total: {purchase.total}
        </div>
        </div>
      </div>
    </div>
  );
}
