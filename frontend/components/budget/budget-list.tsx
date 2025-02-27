"use client";
import { useRouter } from "next/navigation";


interface Budget {
    id: string;
    title: string;
    description: string;
    totalPrice: number;
    eventDate: string;
}

export default function BudgetList({ budgets }: { budgets: Budget[] }) {


    const router = useRouter();

    function handleRowClick(id: string) {
        router.push(`/budget/${id}`);
    }

    return (
        <div>
            <h1>Budgets</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Title</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Total Price</th>
                        <th className="py-2">Event Date</th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.map((budget) => (
                        <tr key={budget.id} onClick={() => handleRowClick(budget.id)} className="cursor-pointer">
                            <td className="py-2">{budget.title}</td>
                            <td className="py-2">{budget.description}</td>
                            <td className="py-2">{budget.totalPrice}</td>
                            <td className="py-2">{new Date(budget.eventDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}