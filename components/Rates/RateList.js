import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { addItems, getRates } from "@/frontend-services/rates";
import { AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
const inter = Inter({ subsets: ["latin"] });

const Inventory = ({ accessToken,fetchData }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const toast = useToast();
  console.log("HERE", accessToken);

  console.log("ITems", items);
  const handleAdd = () => {
    if (!name || !price) {
      alert("Please Enter all the Details");
      return;
    }
    setItems([...items, { name: name, price: price }]);
    setName("");
    setPrice("");
  };

  const addToDB = async () => {
    const data = await addItems(accessToken, items);
    if (data.status === 200) {
      toast({
        title: "Added",
        description: "New items added to Inventory",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setItems([]);
      fetchData();
    } else {
      toast({
        title: "Failed",
        description: "Upload Failed. Try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <div className="flex flex-col w-[90%] items-center">
        <div className="flex flex-col mt-6 w-full">
          <div className="text-[30px] text-center">Add Items</div>
          <div className="flex flex-col my-4 bg-gray-200 items-center p-4 rounded-[10px]">
            <p className="font-bold text-[24px] text-center text-amber-800">
              Items To Add
            </p>
            <div className="flex flex-row font-bold justify-center text-[16px] mt-4 ">
              <p className="mr-10 w-[200px]">Item Name</p>{" "}
              <p className="w-[100px]">Price</p>
            </div>
            {items.map((item, index) => {
              return (
                <div key={index} className="flex flex-row justify-center">
                  <p className="mr-10 w-[200px]">{item.name}</p>
                  <p className="w-[100px]">{item.price}</p>
                </div>
              );
            })}
            <button
            className="mt-6 self-end mr-14 rounded-[10px] bg-blue-600 text-white font-bold w-[120px] h-[50px]"
            onClick={() => {
              addToDB();
            }}
          >
            Update 
          </button>
          </div>
          <div className="flex flex-row items-center">
            <div className="flex flex-col">
              <label>
                <sup>Input Name</sup>
              </label>
              <input
                className=""
                value={name}
                placeholder="Item Name..."
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              ></input>
            </div>
            <div className="ml-4 flex flex-col">
              <label>
                <sup>Price</sup>
              </label>
              <input
                type="number"
                placeholder="Enter Price..."
                value={price}
                onChange={(e) => {
                  setPrice(e.currentTarget.value);
                }}
              />
            </div>
            <AddIcon
              className="border-1 mx-4 rounded-[5px] mt-4 w-[100px] hover:cursor-pointer"
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

export default Inventory;
