import SingleCoin from "@/assets/images/check-in/coin-single.png";
import DoubleCoin from "@/assets/images/check-in/coin-double.png";
import CheckinDialog from "./CheckinDialog";
import { useState } from "react";

export default function CheckinStats() {
  const [open, setOpen] = useState(false);

  const handleOpen = function () {
    setOpen(true);
  };

  return (
    <>
      <section className="mt-8 checkin-days-gradient mx-2 h-24 rounded-lg p-1 px-1 grid grid-cols-7 gap-1 text-xs relative">
        {/* Line */}
        <div className="absolute w-4/5 h-1.5 mt-2.5 bg-golden top-1/2 left-1/2 -translate-x-1/2"></div>

        <div className="flex flex-col gap-1 items-center justify-center relative">
          <p className="">Day 1</p>
          <div className="bg-black size-9 rounded-md flex justify-center items-center">
            <svg
              width="14"
              height="10"
              viewBox="0 0 10 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.11895 0.26593C8.85853 0.0055135 8.4679 0.0055135 8.20749 0.26593L3.32468 5.14874L1.30645 3.13051C1.04603 2.8701 0.655406 2.8701 0.394989 3.13051C0.134572 3.39093 0.134572 3.78156 0.394989 4.04197L2.86895 6.51593C2.99916 6.64614 3.12936 6.71124 3.32468 6.71124C3.51999 6.71124 3.6502 6.64614 3.7804 6.51593L9.11895 1.17739C9.37936 0.916972 9.37936 0.526347 9.11895 0.26593Z"
                fill="#FFAE00"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center justify-center relative">
          <p className="">Day 2</p>
          <div
            className="bg-black size-9 rounded-md flex justify-center items-center"
            onClick={handleOpen}
          >
            <img src={SingleCoin} alt="" className="size-6" />
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center justify-center relative">
          <p className="">Day 3</p>
          <div
            className="bg-black size-11 rounded-md flex justify-center items-center checkin-day-big"
            onClick={handleOpen}
          >
            <img src={DoubleCoin} alt="" className="size-9" />
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center justify-center relative">
          <p className="">Day 4</p>
          <div
            className="bg-black size-9 rounded-md flex justify-center items-center"
            onClick={handleOpen}
          >
            <img src={SingleCoin} alt="" className="size-6" />
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center justify-center relative">
          <p className="">Day 5</p>
          <div
            className="bg-black size-11 rounded-md flex justify-center items-center checkin-day-big"
            onClick={handleOpen}
          >
            <img src={DoubleCoin} alt="" className="size-9" />
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center justify-center relative">
          <p className="">Day 6</p>
          <div
            className="bg-black size-9 rounded-md flex justify-center items-center"
            onClick={handleOpen}
          >
            <img src={SingleCoin} alt="" className="size-6" />
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center justify-center relative">
          <p className="">Day 7</p>
          <div
            className="bg-black size-11 rounded-md flex justify-center items-center checkin-day-big"
            onClick={handleOpen}
          >
            <img src={DoubleCoin} alt="" className="size-9" />
          </div>
        </div>
      </section>

      {open && <CheckinDialog open={open} setOpen={setOpen} />}
    </>
  );
}
