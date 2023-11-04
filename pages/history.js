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
} from "@chakra-ui/react";
import BillGenerator from "@/components/Bill/BillGenerate";
import { getPurchases } from "../frontend-services/purchases";
import { Rates } from "@/components/Rates/Rates";
import { getRates } from "@/frontend-services/rates";
import { Purchases } from "@/components/Purchases/Purchases";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
      console.log("REVER", object.data);
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
      <div className="flex flex-col items-center">
        
        
              <Purchases purchases={purchases} fullWidth={true}/>
           
        
      </div>
    </div>
  );
}
