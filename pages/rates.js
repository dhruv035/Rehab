import { NavBar } from "@/components/Navbar/NavBar";
import { updateRate, getRates } from "@/frontend-services/rates";
import React, { useEffect, useMemo, useState } from "react";
import { verifyToken } from "@/frontend-services/auth";
import { useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import useDimensions from "@/components/hooks/useDimensions";
import RateList from "@/components/Rates/RateList";
export default function Page() {
  const toast = useToast();
  const dimensions = useDimensions();
  const isMobile = useMemo(() => {
    return dimensions.width <= 768;
  }, [dimensions]);
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [rateList, setRateList] = useState([]);
  useEffect(() => {
    fetchRates();
  }, [accessToken]);

  console.log("isMobile", isMobile)
  const fetchRates = async () => {
    if (!accessToken) return;
    const rateListData = await getRates(accessToken);
    if (rateListData.status === 200) {
      console.log("HERE");
      const object = await rateListData.json();
      setRateList(object.data);
    } else {
      return;
    }
  };

  console.log("RATELIST", rateList);
  const initialise = async () => {
    const token = localStorage.getItem("accessToken");
    console.log("token", token);
    if (token.length) {
      const checkData = await verifyToken(token);
      if (checkData.status === 200) {
        setAccessToken(token);
      } else {
        console.log("HERE");
        router.push("");
      }
    } else router.push("");
  };

  useEffect(() => {
    initialise();
  }, []);

  const handleUpdate = async () => {
    const data = await updateRate(
      accessToken,
      rateList[updateIndex].name,
      newPrice,
      newName
    );
    if (data.status === 200) {
      toast({
        title: "Updated",
        description: "The new rate has been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchRates();
      setIsUpdate(false);
      setUpdateIndex(-1);
    } else {
      const object = await data.json();
      toast({
        title: "Update Failed",
        description: object.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex flex-col mt-10 items-center">
        <div className="flex flex-col items-center mt-10 w-[full]">
          <button
            className="w-[150px] h-[30px] rounded-[15px] px-4 bg-green-400"
            onClick={() => setOpen(true)}
          >
            Add New Items
          </button>
          <div className="flex flex-col mt-10 bg-gray-300 p-4 rounded-[20px] min-w-[60%]">
            <div className="text-center text-[50px] font-bold mb-4">
              Rate List
            </div>
            <div className="flex flex-col self-center w-max">
              <div className="flex flex-row p-4 mb-10">
                <p className="w-[20vw] mr-4">Name</p>
                <p className="w-[16vw] mr-4">Price</p>
              </div>
              {rateList.length > 0 &&
                rateList.map((item, index) => {
                  if (index !== updateIndex || !isUpdate)
                    return (
                      <div
                        key={index}
                        className="flex flex-row my-4 p-4 items-end"
                      >
                        <p className="w-[20vw] mr-4">{item.name}</p>

                        <p className="w-[16vw] mr-4">{item.price}</p>

                        <button
                          className="bg-emerald-400 w-[25vw] max-w-[140px] px-4 rounded-[10px]"
                          onClick={() => {
                            setIsUpdate(true);
                            setUpdateIndex(index);
                            setNewPrice(item.price);
                            setNewName(item.name);
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
                })}
            </div>
          </div>
        </div>
      </div>
      <Modal size={"3xl"} isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="min-h-[600px] w-[60vw]">
          <ModalHeader>Add Items</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex justify-center">
            <RateList fetchData={fetchRates} accessToken={accessToken} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
