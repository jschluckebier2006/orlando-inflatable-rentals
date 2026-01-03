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
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-4 pb-2 shrink-0">
          <DialogTitle className="font-display text-xl">Get a Free Quote</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden px-4 pb-4">
          <div className="w-full h-full overflow-hidden rounded-lg">
            <iframe
              title="Contact Form"
              src="https://form.jotform.com/252645641478162?nofs=1"
              className="w-full border-0"
              style={{ marginTop: '-320px', height: 'calc(100% + 380px)' }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allow="geolocation; microphone; camera"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
