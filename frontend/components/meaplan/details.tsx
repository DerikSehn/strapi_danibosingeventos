import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MealPlanDetails({ selectedPartyTypeStructure, isValid, handleNextStep }) {
    return (
        <>
            <ScrollArea className="hidden md:block h-[calc(100vh-300px)] overflow-auto">
                {selectedPartyTypeStructure.map(category => (
                    <div key={category.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{category.title}</h3>
                        {category.products.map(product => (
                            <div key={product.id} className="ml-4 mt-2">
                                <h4 className="text-base font-semibold">{product.title}</h4>
                                <ul className="list-disc ml-4">
                                    {product.product_variants.map(pv => (
                                        <li key={pv.id}>{pv.title}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </ScrollArea>
            <div className="mt-6 md:space-y-2 relative z-10 grid md:block grid-cols-2 bg-[#fff]">
                <Button
                    className="w-full"
                    onClick={handleNextStep}
                    disabled={!isValid}
                >
                    Avançar
                </Button>
                <Link href={'/cardapio'} className="w-full flex items-center justify-center space-x-2 p-1 rounded-lg border hover:bg-muted">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Link>
            </div>
        </>
    );
}