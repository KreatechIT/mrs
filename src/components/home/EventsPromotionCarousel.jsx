import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Event1 from "@/assets/images/promotion-events/promotion-event-1.png";
import Event2 from "@/assets/images/promotion-events/promotion-event-2.png";

export default function EventsPromotionCarousel() {
  return (
    <section className="mt-16 h-48 promotion-events mx-2 rounded-lg p-4 flex flex-col items-center">
      <h2 className="text-center">Promotion & Event</h2>
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-4/5"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1 flex gap-4 w-full justify-center">
                <div>
                  <img src={Event1} alt="" />
                </div>
                <div>
                  <img src={Event2} alt="" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-golden" />
        <CarouselNext className="text-golden" />
      </Carousel>
    </section>
  );
}
