import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ShoppingCart } from "lucide-react";

export default function SummaryCard({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <Card className={cn("sticky top-24 rounded-t-sm ", className)}>
            <CardHeader className="hidden md:block">
                <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2" />
                    Resumo
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}