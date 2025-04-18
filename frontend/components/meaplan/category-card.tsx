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
        <Card className={cn("relative rounded-bl-none", className)}>
            <CardHeader className="ml-[3px] z-10 bg-primary-600">
                <CardTitle className="text-xl ">{item?.title}</CardTitle>
            </CardHeader>
            <CardContent >
              <ProductListWithVariants products={item.products}/>  
            </CardContent>
        </Card>

    )
}