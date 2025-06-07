import { getStrapiData } from "@/lib/utils";
import qs from 'qs';
import { ChefHat } from "lucide-react";
import { unstable_noStore as noStore } from 'next/cache';
import { PureCategory } from "@/types";
import { MostruarioView } from "@/components/custom/mostruario-view";

async function getCategoriesForMostruario(): Promise<PureCategory[]> {
    noStore();
    const query = qs.stringify({
        populate: {
            'categories': {
                populate: [
                    'backgroundImage',
                    'products',
                    'products.image',
                    'products.product_variants',
                    'products.product_variants.image',
                ]
            }
        }
    });
    const result = await getStrapiData(`/api/party-types?${query}`);
    return result.data[0].categories;
}
 
export default async function MostruarioPage() {
    // Fetch categories with products using the same pattern as encomenda
    const categoriesData = await getCategoriesForMostruario();


    if (!categoriesData || categoriesData.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex items-center justify-center">
                <div className="text-center">
                    <ChefHat className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <p className="text-xl text-amber-200">Nenhuma categoria de produto disponível no momento.</p>
                </div>
            </div>
        );
    }

    // Calculate total products for stats
    const totalProducts = categoriesData.reduce((total, category) => {
        return total + (category.products?.reduce((productsCount, product) => productsCount + (product.product_variants?.length ?? 0), 0) ?? 0);
    }, 0);

    return <MostruarioView categoriesData={categoriesData} totalProducts={totalProducts} />;
}
