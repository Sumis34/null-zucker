"use client";

import useZxing from "@/lib/hooks/useZxing";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MinusIcon } from "lucide-react";

const URL_BASE = "https://world.openfoodfacts.net/api/v3/";

interface Product {
  ingredientsText: string;
  productName: string;
  image: string;
}

export default function Home() {
  const [result, setResult] = useState("");
  const [device, setDevice] = useLocalStorage<undefined | string>(
    "zxing-device",
    undefined
  );
  const [product, setProduct] = useState<any | null>(null);

  const { ref, devices } = useZxing({
    onError: (e) => {
      console.log(e);
    },
    onResult: (result) => {
      setResult(result.toString());
    },
    constraints: {
      audio: false,
      video: {
        facingMode: "environment",
        deviceId: device,
      },
    },
  });

  const fetchProduct = async (ean: string) => {
    const res = await fetch(URL_BASE + `product/3017620422003`);

    const data = await res.json();

    console.log(data);

    setProduct(data);
  };

  useEffect(() => {
    fetchProduct("asd");
  }, [result]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <h1>Scanne </h1>
      <div className="aspect-square w-full rounded-2xl overflow-hidden">
        <video ref={ref} />
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Kamera ändern</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Kameras</DrawerTitle>
              <DrawerDescription>Wähle eine Kamera</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              {devices.map((device, i) => {
                return (
                  <Button
                    key={device.deviceId}
                    onClick={() => setDevice(device.deviceId)}
                  >
                    {device.label}
                  </Button>
                );
              })}
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
