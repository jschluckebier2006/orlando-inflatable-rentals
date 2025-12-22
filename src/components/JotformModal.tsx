import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JotformModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JotformModal({ open, onOpenChange }: JotformModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="font-display text-xl">Get a Free Quote</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-4 pt-2">
          <iframe
            title="Contact Form"
            src="https://form.jotform.com/252645641478162"
            className="w-full h-full border-0 rounded-lg"
            allow="geolocation; microphone; camera"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
