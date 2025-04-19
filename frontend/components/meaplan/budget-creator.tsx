"use client"
import { ApiPartyTypePartyType } from "types/generated/contentTypes";
import CategoriesSelector from "../meal-planner/categories-selector";

export default function BudgetCreator({ partyType }: Readonly<{ partyType: ApiPartyTypePartyType['attributes'] }>) {

    return ( 
            <section className="relative z-10 w-full py-32  min-h-screen bg-muted">
                {/* <MotionBackgroundZoom src={partyType.backgroundImage.url} alt="Hero" /> */}

                <div className="relative container px-4 md:px-6 mx-auto">
                    <div className=" text-primary ">
                        <h1 className="text-6xl font-rustic font-bold">2º passo: {partyType?.title} - Monte seu Cardápio</h1>
                        <p className="text-lg mt-4">
                            Escolha os sabores e tipos de salgados e doces de cada categoria para prosseguir com a criação do seu cardápio personalizado.
                        </p>
                    </div>
                    <div className="relative">
                        <CategoriesSelector categories={partyType.categories}/>
                             {/* <MealPlanSummary partyType={partyType}  /> */}
                     </div>
                </div>
            </section> 
    )
}