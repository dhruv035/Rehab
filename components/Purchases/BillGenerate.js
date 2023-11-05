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

  const handleEdit = () => {
    const itemsArray = items;
    itemsArray[orderIndex].quantity = quantity;
    setItems([...itemsArray]);
    editClose();
  };
  const editClose = () => {
    setOrderIndex(-1);
    setIsEdit(false);
    setQuantity("")
  };
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
                    className="my-[1vw] text-[3.5vw] md:text-[16px] px-2 h-[10vw] md:h-[6vw] rounded-[10px] border-[2px] border-blue-800  flex flex-row bg-white items-center justify-center shadow-sm hover:shadow-[0 0.5em 0.5em -0.4em] hover:translate-y-[-2px] w-[98%] max-w-[100%]"
                  >
                    <p className="w-[24vw]  mr-[2vw] md:mr-10 md:w-[200px]">
                      {item.name}
                    </p>
                    <p className="w-[24vw]  md:w-[100px]">{item.price}</p>
                    <p className="w-[24vw]  md:w-[100px]">{item.quantity}</p>
                    {isEdit === false && (
                      <div
                        onClick={() => {
                          setIsEdit(true);
                          setOrderIndex(index);
                          setQuantity(items[index].quantity);
                        }}
                      >
                        <EditIcon />
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex flex-col text-[3vw] md:text-[16px] py-4 bg-gray-400 h rounded-[10px] border-[4px] w-[98%] border-blue-800">
                    <div
                      
                      className="flex flex-row px-2 h-[14vw] bg-red-200 md:h-[6vw] bg-white text-gray items-center justify-center w-full max-w-[100%]"
                    >
                      <p className="w-[24vw]  mr-[2vw] md:mr-10 md:w-[200px]">
                        {item.name}
                      </p>
                      <p className="w-[24vw]  md:w-[100px]">{item.price}</p>
                      <p className="w-[24vw]  md:w-[100px]">{item.quantity}</p>
                    </div>
                    <div className="flex flex-row justify-start bg-green-300 md:text-[16px] h-[10vw] md:h-[6vw]  bg-sky-100 w-full  items-center shadow-[0 0.5em 0.5em -0.4em] w-[98%] max-w-[100%]">
                      <div className="px-2 items-center flex flex-row-reverse w-full">                 

                          <button
                            className="ml-[2vw] border-[1px] text-gray bg-gray-100 text-[2.5vw] md:text-[16px] rounded-[15px] w-[12vw] md:w-[100px] hover:cursor-pointer"
                            
                            onClick={() => {
                              editClose();
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="ml-[2vw] border-[1px] text-white text-[2.5vw] bg-blue-700 md:text-[16px] rounded-[15px] w-[14vw] md:w-[100px] justify-self-center hover:cursor-pointer"
                            
                            onClick={() => {
                              handleEdit();
                            }}
                          >
                            Edit
                          </button>
                          <div className="flex flex-row">
                        
                        
                          <p className="mr-[1vw]">Current</p>
                            <p className="text-red-500 self-center mr-[3vw]">{items[orderIndex].quantity}</p>
                        <p>New Qty</p>
                        
                      
                      <input
                        min="0"
                        className=" ml-[2vw] pl-1 text-[3vw] max-h-[40%] md:text-[16px] w-[10vw] md:w-[180px]  focus:border-blue-200"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          console.log("HERE",e.currentTarget.value)
                          if(e.currentTarget.value=="-")
                          {
                            c
                            alert("Cannot enter a negative value")
                          }
                          else
                          setQuantity(e.currentTarget.value);
                        }}
                      />
                    </div>
                        
                      </div>
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
          {!isEdit && (
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
                min={0}
                  className="border-[1px]  text-[3vw] md:text-[16px] border-blue-100 p-2 rounded-[10px] w-[14vw] md:w-[180px] max-w-[60px] focus:border-blue-200"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    console.log("ABC",e.currentTarget.value)
                    if(e.currentTarget.value<0)
                   { alert("Cannot enter negative value")
                   setQuantity("")
                  }
                    else
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
          )}
        </div>
      </div>
    </>
  );
};

export default BillGenerator;
