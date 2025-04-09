import { Button } from "@/components/ui/button";

interface ActionFooterProps {
  onNext?: () => void;
  onReset?: () => void;
  nextLabel?: string;
  resetLabel?: string;
  nextDisabled?: boolean;
  resetDisabled?: boolean;
  isLoading?: boolean;
}

export default function ActionFooter({
  onNext,
  onReset,
  nextLabel = "Próximo",
  resetLabel = "Resetar",
  nextDisabled = false,
  resetDisabled = false,
  isLoading = false,
}: Readonly<ActionFooterProps>) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3 px-4 shadow-lg z-50">
      <div className="container max-w-4xl mx-auto flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onReset} 
          disabled={resetDisabled || isLoading}
        >
          {resetLabel}
        </Button>
        <Button 
          onClick={onNext} 
          disabled={nextDisabled || isLoading}
        >
          {isLoading ? "Processando..." : nextLabel}
        </Button>
      </div>
    </div>
  );
}