import { Button } from "@/components/ui/button";
import ActionFooterSummary from "./action-footer-summary"; // Import the new summary component
import { cn } from "@/lib/utils";

interface ActionFooterProps {
  onNext?: () => void;
  onReset?: () => void;
  nextLabel?: string;
  resetLabel?: string;
  nextDisabled?: boolean;
  resetDisabled?: boolean;
  isLoading?: boolean;
  itemCount?: number; // Add itemCount prop
}

export default function ActionFooter({
  onNext,
  onReset,
  nextLabel = "Próximo",
  resetLabel = "Limpar Seleção",
  nextDisabled = false,
  resetDisabled = false,
  isLoading = false,
  itemCount = 0, // Destructure itemCount with default value
}: Readonly<ActionFooterProps>) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white-900 border-t shadow-lg z-50">
      {/* Adjust layout: add items-center */}
      <div className="container max-w-screen-2xl mx-auto flex  items-center gap-4">
        {/* Render the summary component */}
        <ActionFooterSummary itemCount={itemCount} />

        {/* Group buttons */}
        <div className="flex justify-end w-full max-w-[400px] ml-auto">
          <Button
            variant="default"
            onClick={onReset}
            disabled={resetDisabled || isLoading}
            className={cn("text-2xl font-food opacity-100 p-8 rounded-none bg-primary-100", itemCount === 0   ? 'transition-opacity opacity-0' : 
              '')
            }
          >
            {resetLabel}
          </Button>
          <Button
            variant={"default"}
            onClick={onNext}
            disabled={nextDisabled || isLoading || itemCount === 0}
            className={cn("text-3xl font-food opacity-100 p-8 rounded-none bg-primary-400", itemCount === 0   ? 'transition-opacity opacity-0' : 
              '')
            }
          >
            {isLoading ? "Processando..." : nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}