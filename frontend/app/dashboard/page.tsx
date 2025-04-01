import BudgetList from "@/components/budget/budget-list";
import { LogoutButton } from "@/components/custom/logout-button";
import { getStrapiData } from "@/lib/utils";

export default async function DashboardPage() {

    const budgets = (await getStrapiData('/api/budgets')).data;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-8 py-12 md:py-48">
            <h1 className="text-8xl font-rustic text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">Dashboard</h1>
            <BudgetList budgets={budgets} />
            <LogoutButton />
        </div>);

}