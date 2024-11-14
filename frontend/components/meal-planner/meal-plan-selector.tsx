import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MealCategory, MealPlan } from '@prisma/client'

interface PlanSelectorProps {
    mealPlans: (MealPlan & { mealCategories: MealCategory[] })[]
    onSelect: (planId: number) => void
}

const colors = [
    '#5baee1',
    '#fea82f',
    '#9eb46a',
]

export default function PlanSelector({ mealPlans, onSelect }: PlanSelectorProps) {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <h2 className="text-2xl w-full text-center font-semibold mb-4 text-primary-900 xl:text-4xl">
                Agora, escolha um plano
            </h2>
            <div className="grid lg:grid-cols-2 gap-6 mt-20">
                {mealPlans.map((plan, index) => (
                    <Card
                        key={plan.id}
                        className={`h-[400px] max-h-[60vh] flex flex-col ${selectedPlan === plan.id ? 'ring-2 ' : ''}`}
                    >
                        <CardHeader
                            className="text-white h-10"
                            style={{
                                backgroundColor: colors[index % 3]
                            }}
                        >
                            <h3 className="text-lg font-blod text-center">{plan.name}</h3>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            {plan.description && <p className="text-sm text-gray-600 mb-4">{plan.description}</p>}
                            <ul className="space-y-2">
                                {plan.mealCategories.map((category, categoryIndex) => (
                                    <li key={categoryIndex} className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    setSelectedPlan(plan.id)
                                    onSelect(plan.id)
                                }}
                            >
                                Selecionar
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}