import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { getRates } from "@/frontend-services/rates";
import { AddIcon } from "@chakra-ui/icons";
import { addPurchase } from "@/frontend-services/purchases";

const inter = Inter({ subsets: ["latin"] });

const BillGenerator = ({ accessToken,fetchPurchases }) => {
  const [items, setItems] = useState([]);
  const [rateList, setRateList] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  console.log("SELECTED IS", selectedIndex);
  console.log("RATELIST", rateList, items);

  const total = useMemo(() => {
    let sum = 0;
    items.forEach((element) => {
      sum += element.amount;
    });
    return sum;
  }, [items]);
  console.log("TOTAL", total);
  useEffect(() => {
    getRates(accessToken).then(async (res) => {
      const data = await res.json();
      if (data?.data?.length > 0) {
        setRateList(data.data);
        setSelectedIndex(data.data.length)
      }
    });
  }, []);
  const handleAdd = () => {
    if(!quantity)
    {
      alert("Please select Quantity")
      return;
    }
    setItems([
      ...items,
      {
        name: rateList[selectedIndex].name,
        price: rateList[selectedIndex].price,
        quantity: quantity,
        amount: rateList[selectedIndex].price * quantity,
      },
    ]);
    setQuantity("");
    setSelectedIndex(rateList.length);
  };
  const addToDB = async () => {
    const data = await addPurchase(accessToken,items)
   if(data.status===200)
   {
    console.log("RES",await data.json())
    setItems([])
    fetchPurchases(accessToken);
  }
  };
  console.log("ITEMS", items);
  return (
    <>
      <div className="flex flex-col w-[90%] items-center">
        <div className="flex flex-col mt-6 w-full">
          <div className="text-[30px] text-center">Purchase Order</div>
          <div className="flex flex-col my-4 bg-gray-200 items-center p-4 rounded-[10px]">
            <p className="font-bold text-[24px] text-center text-amber-800">
              Order Details
            </p>
            <div className="flex flex-row font-bold justify-center text-[16px] mt-4 ">
              <p className="mr-10 w-[200px]">Item Name</p>{" "}
              <p className="w-[100px]">Price</p>
              <p className="w-[100px]">Quantity</p>
            </div>
            {items.map((item, index) => {
              return (
                <div key={index} className="flex flex-row justify-center">
                  <p className="mr-10 w-[200px]">{item.name}</p>
                  <p className="w-[100px]">{item.price}</p>
                  <p className="w-[100px]">{item.quantity}</p>
                </div>
              );
            })}
            <div className="mt-6 self-end mr-14 text-black font-bold w-[120px] h-[50px]">Total: {total}</div>
            <button
              className="mt-6 self-end mr-14 rounded-[10px] bg-blue-600 text-white font-bold w-[120px] h-[50px]"
              onClick={() => {
                console.log("HI")
                addToDB()
              }}
            >
              Update
            </button>
          </div>
          <div className="flex flex-row items-center">
            <div className="flex flex-col">
              <label>
                <sup>Select Item: {selectedIndex!==-1&&selectedIndex<rateList.length?rateList[selectedIndex].name+"(@"+rateList[selectedIndex].price+")":""}</sup>
              </label>
              <select
              
              value={selectedIndex}
                onChange={(e) => {
                  console.log("ANOTHER", e.currentTarget.value);
                  setSelectedIndex(e.currentTarget.value);
                }}
                className="w-[200px] border-[1px] p-2 border-blue-100 rounded-[10px] focus:border-blue-200"
              >
                {rateList &&
                  rateList.map((item, index) => {
                    console.log("HERE", index);
                    return (
                      <option key={index} value={index}>
                        {item.name}
                      </option>
                    );
                  })}
                  <option disabled  value={rateList.length}> -- select an option -- </option>
              </select>
            </div>
            <div className="ml-4 flex flex-col">
              <label>
                <sup>Quantity</sup>
              </label>
              <input
              className="border-[1px] border-blue-100 p-2 rounded-[10px] focus:border-blue-200"
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.currentTarget.value);
                }}
              />
            </div>
            <AddIcon
              className="ml-4 border-1 rounded-[5px] mt-4 w-[100px] hover:cursor-pointer"
              boxSize={6}
              onClick={() => {
                handleAdd();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BillGenerator;
