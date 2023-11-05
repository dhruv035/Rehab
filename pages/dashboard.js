import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { NavBar } from "@/components/Navbar/NavBar";
import { verifyToken } from "../frontend-services/auth";
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import BillGenerator from "@/components/Purchases/BillGenerate";
import { getPurchases } from "../frontend-services/purchases";
import { Rates } from "@/components/Rates/Rates";
import { getRates } from "@/frontend-services/rates";
import { Purchases } from "@/components/Purchases/Purchases";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const toast = useToast();
  const [accessToken, setAccessToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [rateList, setRateList] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    fetchPurchases();
    fetchRates();
  }, [accessToken]);

  const fetchPurchases = async () => {
    const purchaseData = await getPurchases(accessToken);
    if (purchaseData.status === 200) {
      const object = await purchaseData.json();
      object.data.reverse();
      console.log("REVER",object.data)
      setPurchases(object.data);
    } else {
      return;
    }
  };
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
  const router = useRouter();

  const initialise = async () => {
    let status = 0;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    if (token.length) {
      const checkData = await verifyToken(token);
      if (checkData.status === 200) {
       
        setAccessToken(token);
      } else {
        toast({
          title: 'Token Error',
          description: object.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        router.push("/");
      }
    } else router.push("/");
  };

  useEffect(() => {
    initialise();
  }, []);

  const onClose = async () => {
    setIsOpen(false);
  };
  console.log("PURCHASES", purchases);
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex flex-col max-w-[100%] items-center">
        <div className=" w-full max-w-[100%] md:w-auto flex flex-col md:flex-row ">
          <Rates rates={rateList} />
          <div>
            <div>
              <Purchases purchases={purchases} trunc={true} />
            </div>
          </div>
        </div>
        <button className="mt-4 bg-blue-800 rounded-[10px] h-[80px] w-[150px] p-2 font-bold" onClick={() => setIsOpen(true)}>Add Purchase Order</button>
      </div>
      <Modal size={"3xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="min-h-[600px] w-[60vw]">
          <ModalHeader alignSelf={"center"} >Purchase Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <BillGenerator
              accessToken={accessToken}
              onClose={onClose}
              fetchPurchases={fetchPurchases}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
