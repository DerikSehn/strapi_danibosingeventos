// frontend/app/encomenda/page.tsx
import OrderPageClient from '@/components/order/order-page-client';
import { getStrapiData } from '@/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';
import qs from 'qs';
import type { PureCategory, PureImage, PureProduct, PureProductVariant } from '../../types'; // Corrected import path for Pure types


async function getCategoriesForOrder(): Promise<PureCategory[]> { // Return PureCategory[]
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
  const result = (await getStrapiData(`/api/party-types?${query}`));

  return result.data[0].categories;


}

export default async function EncomendaPage() {
  const categoriesData = await getCategoriesForOrder();

  console.log('Pure Categories Data:', JSON.stringify(categoriesData, null, 2));

  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-muted-foreground">Nenhuma categoria de produto disponível para encomenda no momento.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-0">
      <OrderPageClient categories={categoriesData} />
    </div>

  );
}
