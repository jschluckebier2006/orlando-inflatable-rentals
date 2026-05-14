import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StartHereModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartHereModal({ open, onOpenChange }: StartHereModalProps) {
  const [stage, setStage] = useState<"welcome" | "quote">("welcome");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStage("welcome"), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleReserveOnline = () => {
    onOpenChange(false);
    navigate("/rentals");
  };

  return (
    
      
        {stage === "welcome" ? (
          


            
              
                Let's get your party started.
              
              
                Two quick ways to book — pick what fits your event.
              
            

            


              
                


                  


                    

Browse & Reserve →


                    


                      Pick your inflatables, see availability, book online.
                    


                  


                  
                


              


               setStage("quote")}
                className="w-full text-left rounded-xl border-2 border-accent/30 hover:border-accent bg-accent/5 hover:bg-accent/10 transition-colors p-5 group"
              >
                


                  


                    

Get a Custom Quote →


                    


                      Personalized guidance & package for your event.
                    


                  


                  
                


              
            


          


        ) : (
          


            


               setStage("welcome")}>
                
                Back
              
              Custom Quote
            


            
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
