import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import TournamentIcon from "@/assets/images/icons/tournament.svg";
import CalendarIcon from "@/assets/images/icons/calendar.svg";
import PrizePoolIcon from "@/assets/images/icons/prize-pool.svg";

export default function TournamentDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dialog-bg sm:max-w-xs overflow-x-hidden text-xs">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-1 -mt-4">
          <h2 className="text-base font-medium flex items-center gap-1">
            <span>
              <img src={TournamentIcon} alt="" className="size-5" />
            </span>
            Tournament Name :
          </h2>
          <h3 className="text-sm flex items-center gap-1">
            <span>
              <img src={CalendarIcon} alt="" className="size-4" />
            </span>
            Start - End :{" "}
            <span className="underline decoration-golden">
              Jun 25 - Jul 5, 2025
            </span>
          </h3>
          <h3 className="text-sm flex items-center gap-1">
            <span>
              <img src={PrizePoolIcon} alt="" className="size-4" />
            </span>
            Prize Pool :{" "}
            <span className="text-golden text-base font-semibold">50,000</span>
          </h3>
        </div>

        <div className="space-y-1">
          <h4 className="flex items-center gap-1 text-base mb-2">
            <span className="inline-block h-1 w-8 bg-gradient-to-r from-golden to-white"></span>
            Your Status
            <span className="inline-block h-1 w-8 bg-gradient-to-l from-golden to-white"></span>
          </h4>
          <p>Your Rank: #4</p>
          <p>Your Score: 8,750 pts</p>
          <p>Your need 500 pts to reach Top 10!</p>
        </div>

        <div className="space-y-1">
          <h4 className="flex items-center gap-1 text-base mb-2">
            <span className="inline-block h-1 w-8 bg-gradient-to-r from-golden to-white"></span>
            Leaderboard (Top 5)
            <span className="inline-block h-1 w-8 bg-gradient-to-l from-golden to-white"></span>
          </h4>
          <p>1. LuckyMaster21 - 15,350 pts</p>
          <p>2. SpinKing88 - 12,940 pts</p>
          <p>3. MegaWinZone - 11,500 pts</p>
          <p>4. FastFinger2025 - 10,420 pts</p>
          <p>5. LadyLuck777 - 9,980 pts</p>
        </div>

        <div className="space-y-1">
          <h4 className="flex items-center gap-1 text-base mb-2">
            <span className="inline-block h-1 w-8 bg-gradient-to-r from-golden to-white"></span>
            Rules Summary
            <span className="inline-block h-1 w-8 bg-gradient-to-l from-golden to-white"></span>
          </h4>
          <p>
            Play Lucky Spin to earn points. Min. 100 bets required to qualify.
            No multiple accounts allowed.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="flex items-center gap-1 text-base mb-2">
            <span className="inline-block h-1 w-8 bg-gradient-to-r from-golden to-white"></span>
            Reward Breakdown
            <span className="inline-block h-1 w-8 bg-gradient-to-l from-golden to-white"></span>
          </h4>
          <p>🥇 1st – ৳50,000 </p>
          <p>🥈 2nd – ৳30,000</p>
          <p>🥉 3rd – ৳20,000</p>
          <p>
            {" "}
            <span className="inline-block w-4"></span>4th–10th – ৳1,000
          </p>
        </div>

        <Button className="dialog-button mt-4" onClick={() => setOpen(false)}>
          Join Now
        </Button>
      </DialogContent>
    </Dialog>
  );
}
