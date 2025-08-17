import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function CheckinDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dialog-bg sm:max-w-xs overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-left font-medium">
            🎉 Daily Check-in Reward{" "}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="text-sm mt-4">
          Congratulations! You've checked in for today and earned{" "}
          <span className="text-golden">+50 bonus</span> points!
        </div>

        <Button className="dialog-button mt-4" onClick={() => setOpen(false)}>
          Claim Your Points
        </Button>
      </DialogContent>
    </Dialog>
  );
}
