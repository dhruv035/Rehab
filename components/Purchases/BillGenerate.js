import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { getRates } from "@/frontend-services/rates";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { addPurchase } from "@/frontend-services/purchases";
import useDimensions from "../hooks/useDimensions";

const inter = Inter({ subsets: ["latin"] });

const BillGenerator = ({ accessToken, fetchPurchases }) => {
  const [items, setItems] = useState([]);
  const dimensions = useDimensions();
  const [rateList, setRateList] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [orderIndex, setOrderIndex] = useState(-1);
  const [isEdit, setIsEdit] = useState(false);
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
        setSelectedIndex(data.data.length);
      }
    });
  }, []);
  const handleAdd = () => {
    if (!selectedIndex || selectedIndex >= rateList.length) {
      alert("Please select an item");
      return;
    }
    if (!quantity) {
      alert("Please select Quantity");
      return;
    }
    let previousQty = 0;
    const newItems = items.filter((element) => {
      if (element.name === rateList[selectedIndex].name) {
        previousQty += Number(element.quantity);
      }
      return element.name !== rateList[selectedIndex].name;
    });

    const updatedElement = {
      name: rateList[selectedIndex].name,
      price: rateList[selectedIndex].price,
      quantity: (Number(quantity) + previousQty).toString(),
      amount: rateList[selectedIndex].price * quantity,
    };
    if (newItems)
      setItems([
        ...newItems,
        {
          ...updatedElement,
        },
      ]);
    else setItems([...items, { ...updatedElement }]);
    setQuantity("");
    setSelectedIndex(rateList.length);
  };
  const addToDB = async () => {
    const data = await addPurchase(accessToken, items);
    if (data.status === 200) {
      console.log("RES", await data.json());
      setItems([]);
      fetchPurchases(accessToken);
    }
  };
  console.log("ITEMS", items);
  return (
    <>
      <div className="flex flex-col w-[100%]">
        <div className="flex flex-col w-full max-w-[100%]">
          <div className="flex flex-col  bg-gray-200 items-center py-4 px-2 mb-2 md:p-4 rounded-[10px]">
            <p className="font-bold text-[5vw] text-center text-amber-800 md:text-[24px]">
              Order Details
            </p>
            <div className="flex flex-row  font-bold text-[4vw] justify-center md:text-[16px] mt-4 ">
              <p className="mr-[2vw] md:mr-10 w-[24vw] md:w-[200px]">
                Item Name
              </p>{" "}
              <p className="w-[24vw] md:w-[100px]">Price</p>
              <p className="w-[24vw] md:w-[100px]">Quantity</p>
            </div>
            {items.map((item, index) => {
              if (index !== orderIndex || !isEdit) {
                return (
                  <div
                    key={index}
                    className="my-[1vw] h-[10vw] md:h-[6vw] flex flex-row bg-white items-center justify-center shadow-sm hover:shadow-[0 0.5em 0.5em -0.4em] hover:translate-y-[-2px] w-[98%] max-w-[100%]"
                  >
                    <p className="w-[24vw] text-[3.5vw] md:text-[16px] mr-[2vw] md:mr-10 md:w-[200px]">
                      {item.name}
                    </p>
                    <p className="w-[24vw] text-[3.5vw] md:text-[16px] md:w-[100px]">
                      {item.price}
                    </p>
                    <p className="w-[24vw] text-[3.5vw] md:text-[16px] md:w-[100px]">
                      {item.quantity}
                    </p>
                    {isEdit === false && (
                      <div
                        onClick={() => {
                          setIsEdit(true);
                          setOrderIndex(index);
                        }}
                      >
                        <EditIcon />
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="flex flex-row p-4 w-full text-[3vw] md:text-[16px] rounded-[20px] border-[1px] border-blue-700 items-center bg-white"
                  >
                    <div className="flex self-center py-2  w-[16vw] mr-4 flex-col">
                      <sup className="">{isMobile?"":"Name:"} {item.name}</sup>
                      <textarea
                        value={newName}
                        rows={2}
                        
                        className="my-2 border-[2px] px-1 md:h-auto max-w-[250px] border-blue-200 rounded-[5px]"
                        onChange={(e) => setNewName(e.currentTarget.value)}
                        placeholder="New Name..."
                      ></textarea>
                       
                    </div>
                    <div className="flex self-center py-2 w-[16vw] mr-4 flex-col">
                      <sup className="">Price: {item.price}</sup>
                      <input
                        type="number"
                        className="my-2 border-[2px] px-2 max-w-[250px] border-blue-200 rounded-[5px]"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.currentTarget.value)}
                        placeholder="New Price..."
                      ></input>
                    </div>
                    <div>
                      <button
                        className="rounded-[24px] mx-2 my-2 p-2  bg-gray-100"
                        onClick={() => {
                          setIsUpdate(false);
                          setUpdateIndex(-1);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        
                        className="rounded-[24px] mx-2 my-2 p-2 bg-green-400"
                        onClick={() => {
                          handleUpdate();
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                );
              }
            })}
            <div className="mt-6 self-end mr-14 text-black font-bold w-[120px] h-[50px]">
              Total: {total}
            </div>
            {items.length > 0 && (
              <button
                className="mt-6 self-end mr-14 rounded-[10px] bg-blue-600 text-white font-bold w-[120px] h-[50px]"
                onClick={() => {
                  console.log("HI");
                  addToDB();
                }}
              >
                Update
              </button>
            )}
          </div>
          <div className="flex flex-row items-center">
            <div className="flex flex-col">
              <label>
                <sup>
                  Select Item:{" "}
                  {selectedIndex !== -1 && selectedIndex < rateList.length
                    ? rateList[selectedIndex].name +
                      "(@" +
                      rateList[selectedIndex].price +
                      ")"
                    : ""}
                </sup>
              </label>
              <select
                value={selectedIndex}
                onChange={(e) => {
                  console.log("ANOTHER", e.currentTarget.value);
                  setSelectedIndex(e.currentTarget.value);
                }}
                className="appearance-none w-[md:w-[200px] text-[3vw] md:text-[16px] border-[1px] p-2 border-blue-100 rounded-[10px] focus:border-blue-200"
              >
                {rateList &&
                  rateList.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.name}
                      </option>
                    );
                  })}
                <option disabled value={rateList.length}>
                  Select Item...
                </option>
              </select>
            </div>
            <div className="ml-4 flex flex-col">
              <label>
                <sup>Quantity</sup>
              </label>
              <input
                className="border-[1px]  text-[3vw] md:text-[16px] border-blue-100 p-2 rounded-[10px] w-[14vw] md:w-[180px] max-w-[60px] focus:border-blue-200"
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.currentTarget.value);
                }}
              />
            </div>
            <AddIcon
              className="ml-4 border-1 rounded-[5px] mt-4 md:w-[100px] hover:cursor-pointer"
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
