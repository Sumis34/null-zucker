"use client";

import useZxing from "@/lib/hooks/useZxing";
import { useEffect, useState } from "react";
// import { useLocalStorage } from "@uidotdev/usehooks";
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
import { Bolt } from "lucide-react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

const URL_BASE = "https://world.openfoodfacts.net/api/v3/";

interface Product {
  ingredientsText: string;
  productName: string;
  image: string;
  sugar: number;
  warnLevel: "noSugar" | "noExtraSugar" | "sugar";
}

export default function Home() {
  const [result, setResult] = useState("");
  // const [device, setDevice] = useState<undefined | string>(
  //   "zxing-device",
  //   undefined
  // );
  const [device, setDevice] = useState<undefined | string>(undefined);
  const [product, setProduct] = useState<Product | null>(null);

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

  const fetchProduct = async (id: string) => {
    // const res = await fetch(URL_BASE + `product/3017620422003?cc=ch&lc=de`);
    const res = await fetch(URL_BASE + `product/${id}?cc=ch&lc=de`);

    const data = await res.json();

    console.log(data);

    setProduct({
      ingredientsText: data.product.ingredients_text_de,
      image: data.product.image_front_url,
      productName:
        data.product.abbreviated_product_name || data.product.generic_name_de,
      sugar: data.product.nutriments.sugars_100g,
      // sugar: data.product.ingredients.find((i: any) => i.id === "en:sugar")
      //   ?.percent_estimate as number,
      warnLevel: data.product.ingredients_text_de
        .toLowerCase()
        .includes("zucker")
        ? "sugar"
        : data.product.nutriments.sugars_100g > 0
        ? "noExtraSugar"
        : "noSugar",
    });
  };

  useEffect(() => {
    if (!result) return;
    fetchProduct(result);
  }, [result]);

  const reset = () => {
    setResult("");
    setProduct(null);
  };

  const WARNING = {
    noSugar: "Enthält keinen zusätzlichen Zucker",
    noExtraSugar: "Enthält keinen zusätzlichen Zucker",
    sugar: "Enthält nicht natürlichen Zucker!",
  };

  return (
    <main className="flex h-[calc(100dvh)] w-screen flex-col items-center justify-between p-5 relative bg-background">
      <h1 className="font-bold">#null-zucker</h1>
      {!product ? (
        <div>
          <div className="aspect-square w-full rounded-2xl overflow-hidden">
            <video ref={ref} />
            {devices.length === 0 && (
              <p>
                Keine Kamera Gefunden, verwenden sie ein Gerät mit integrierter
                Kamera
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground p-2">
            Scanne ein Barcode um herauszufinden wie viel Zucker im Produkt
            steckt.
          </p>
        </div>
      ) : (
        <div>
          {/* <img
            src={product.image}
            className="aspect-square w-full rounded-2xl m-10"
            alt="Product Image"
          /> */}
          <h3 className="text-center text-3xl mb-8">{product.productName}</h3>

          <div className="text-center">
            <div className="text-9xl font-bold">
              <CountUp end={product.sugar} />g
            </div>
            <p className="text-muted-foreground mt-2">Zucker pro 100g</p>
          </div>

          <p
            className={cn(
              "p-3 rounded-lg text-sm mt-2",
              product.warnLevel === "noSugar" && "bg-green-200",
              product.warnLevel === "noExtraSugar" && "bg-yellow-200",
              product.warnLevel === "sugar" && "bg-red-200 text-red-900"
            )}
          >
            {WARNING[product.warnLevel]}
          </p>
        </div>
      )}
      <div>
        {product && (
          <Button
            onClick={() => {
              reset();
            }}
          >
            Neu scannen
          </Button>
        )}
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="absolute m-5 top-0 right-0">
            <Bolt />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Wähle eine Kamera</DrawerTitle>
              <DrawerDescription>Wähle eine Kamera</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              {devices.length === 0 && (
                <Button onClick={() => fetchProduct("3017620422003")}>
                  Fetch
                </Button>
              )}
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
                <Button size={"lg"} variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
