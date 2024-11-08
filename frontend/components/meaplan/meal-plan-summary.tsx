import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { ApiCategoryCategory, ApiPartyTypePartyType } from "types/generated/contentTypes";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { createAndSendBudget } from "@/app/actions";

const validateSelection = (categories: (ApiCategoryCategory['attributes'])[]) => {
    return categories.every(category =>
        category.products.every(product =>
            !!product.product_variants.length)
    );
};

export default function MealPlanSummary({ partyType, selectedItems = {} }: { partyType: ApiPartyTypePartyType['attributes'], selectedItems: Record<string, any[]> }) {
    const selectedMeals = Object.values(selectedItems).filter(Boolean);

    const totalPrice = selectedMeals.reduce((total, meal) => total + meal.price, 0);

    const selectedPartyTypeStructure = partyType.categories.map(category => ({
        ...category,
        products: category.products.map(product => ({
            ...product,
            product_variants: product.product_variants.filter(pv => pv.id in selectedItems && selectedItems[pv.id])
        }))
    }));

    const isValid = validateSelection(selectedPartyTypeStructure);

    console.log({ selectedPartyTypeStructure });

    const handleOrder = async () => {
        try {
            const data = await createAndSendBudget(partyType, selectedItems);

            if (data.success) {
                alert('Orçamento enviado com sucesso!');
            } else {
                alert('Erro ao enviar orçamento. Por favor, tente novamente.');
            }
        } catch (error) {
            alert('Erro ao enviar orçamento. Por favor, tente novamente.');
        }
    };

    return (
        <Card className="sticky top-24 rounded-t-sm ">
            <CardHeader className="hidden md:block">
                <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2" />
                    Resumo
                </CardTitle>
            </CardHeader>
            <CardContent>
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

                <div className="mt-6 md:space-y-2 relative z-10  grid md:block grid-cols-2 bg-[#fff]">

                    <Button
                        className="w-full"
                        onClick={handleOrder}
                        disabled={!isValid}
                    >
                        Finalizar pedido
                    </Button>
                    <Link href={'/'} className="w-full flex items-center justify-center space-x-2 p-1 rounded-lg border hover:bg-muted">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}