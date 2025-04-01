import { BudgetProvider } from "@/lib/context/budget-context";

export default function CardapioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BudgetProvider>
      {children}
    </BudgetProvider>
  );
}
