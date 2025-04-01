import { cn } from "@/lib/utils";
import { ApiCategoryCategory } from "types/generated/contentTypes";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ProductListWithVariants from "./product-with-variant";

interface CategoryCardProps {
    item: ApiCategoryCategory['attributes'];
    className?: string;
}

export default function CategoryCard({ item, className }: Readonly<CategoryCardProps>) {
    return (
        <Card className={cn("relative", className)}>
            <span className="absolute inset-x-0 bg-primary-500/80 h-1 z-20" />
            <CardHeader className="sticky top-0 z-10 bg-[#fff]">
                <CardTitle className="text-3xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <>
                    {/*   <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{item.products?.length || 0} Produto{item.products?.length > 1 ? 's' : ''} vinculado{item.products?.length > 1 ? 's' : ''}</span>
                    </div> */}
                    <ProductListWithVariants products={item.products}/>
                </>
            </CardContent>
        </Card>

    )
}