"use client"
import CategoryCard from "./category-card";
import { ApiPartyTypePartyType } from "types/generated/contentTypes";
import MealPlanSummary from "./meal-plan-summary";
import { useState } from "react";

export default function CategoriesSelector({ partyType }: { partyType: ApiPartyTypePartyType['attributes'] }) {
    const [selectedItems, setSelectedItems] = useState<Record<string, any[]>>({});

    const handleSelectProductVariant = (id: string, item: any) => {
        setSelectedItems(pvSt => ({
            ...selectedItems,
            [id]: pvSt[id] ? null : item
        }));
    };

    return (
        < >
            <section className=" z-10 w-full py-12 md:py-24 lg:py-32 xl:py-48 min-h-screen bg-muted">
                <ul className="container px-4 md:px-6 mx-auto">
                    <header className="bg-gradient-to-tr from-neutral-900/80 to-black/70 shadow-lg text-white-900 p-4">
                        <h1 className="text-3xl font-bold">{partyType.title}: Monte seu Cardápio</h1>
                    </header>
                    <div className="relative grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6 my-6">
                            {partyType?.categories.map((item: any, index: any) => (
                                <CategoryCard key={index} item={item} onSelect={handleSelectProductVariant} />
                            ))}
                        </div>
                        <span className="hidden md:block my-6">
                            <MealPlanSummary partyType={partyType} selectedItems={selectedItems} />
                        </span>
                    </div>
                </ul>
            </section>

            <span className="md:hidden fixed bottom-0 w-full h-28">
                <MealPlanSummary partyType={partyType} selectedItems={selectedItems} />
            </span>
        </>
    )
}