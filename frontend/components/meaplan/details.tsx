import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronLeft, X } from "lucide-react";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { ApiProductProduct, ApiProductVariantProductVariant } from "types/generated/contentTypes";

interface DetailsProps {
    selectedPartyTypeStructure: any[];
    isValid: boolean;
}

export default function MealPlanDetails({ selectedPartyTypeStructure, isValid }: Readonly<DetailsProps>) {
    const { removeItem } = useMealItemsStore();
    
    const handleRemoveItem = (item: ApiProductVariantProductVariant['attributes']) => {
        removeItem(item);
    };
    
    return (
        <Fragment>
            <ScrollArea className="hidden md:block h-[calc(100vh-300px)] overflow-auto">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b">
                            <th className="text-left p-2">Categoria</th>
                            <th className="text-left p-2">Produto</th>
                            <th className="text-left p-2">Sabor</th>
                            <th className="text-center p-2">Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPartyTypeStructure.flatMap((category) => 
                            category.products.flatMap((product: ApiProductProduct['attributes']) => 
                                product.product_variants.map((pv: ApiProductVariantProductVariant['attributes']) => (
                                    <tr key={`${category.id}-${product.id}-${pv.id}`} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{category.title}</td>
                                        <td className="p-2">{product.title}</td>
                                        <td className="p-2">{pv.title}</td>
                                        <td className="text-center p-2">
                                            <button
                                                onClick={() => handleRemoveItem(pv)}
                                                className="text-red-500 hover:text-red-700 rounded-full p-1 hover:bg-red-100"
                                            >
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                        {!isValid && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">
                                    Nenhum item selecionado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </ScrollArea>
            
            <div className="mt-6 md:space-y-2 relative z-10 grid md:block grid-cols-2 bg-[#fff]">
                <Link href="/cardapio" className="w-full flex items-center justify-center space-x-2 p-1 rounded-lg border hover:bg-muted">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Link>
            </div>
        </Fragment>
    );
}