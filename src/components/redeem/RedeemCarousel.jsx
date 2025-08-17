import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import AirpodsImg from "@/assets/images/airpods.png";

// Sample product data
const products = [
  {
    id: 1,
    name: "AirPods Pro",
    points: "61,100 pts",
    image: AirpodsImg,
  },
  {
    id: 2,
    name: "AirPods (2nd Gen)",
    points: "61,100 pts",
    image: AirpodsImg,
  },
  {
    id: 3,
    name: "AirPods Max",
    points: "89,900 pts",
    image: AirpodsImg,
  },
  {
    id: 4,
    name: "AirPods (3rd Gen)",
    points: "45,500 pts",
    image: AirpodsImg,
  },
  {
    id: 5,
    name: "AirPods Pro",
    points: "65,200 pts",
    image: AirpodsImg,
  },
];

export default function RedeemCarousel() {
  return (
    <section className=" h-auto mx-2 rounded-lg px-4 py-2 flex flex-col items-center">
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-1/2 h-full">
              <div className="gift-card p-4">
                {/* Product Image Container */}
                <div className="flex justify-center mb-2.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="text-center space-y-1">
                  <h3 className="text-white font-medium text-xs leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-golden font-medium text-[11px]">
                    {product.points}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-yellow-500 border-yellow-500/30  -left-4" />
        <CarouselNext className="text-yellow-500 border-yellow-500/30  -right-4" />
      </Carousel>
    </section>
  );
}
