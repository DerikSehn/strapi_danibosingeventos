
import CategoriesSelector from '@/components/meaplan/categories-selector';
import { getStrapiData } from '@/lib/utils';
import qs from 'qs';
import { ApiPartyTypePartyType } from 'types/generated/contentTypes';

export default async function CategoriesPage({ params }: any) {
    const { id } = await params;

    const query = qs.stringify({
        filters: {
            caption: id
        },
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
    const partyType: ApiPartyTypePartyType['attributes'] = result.data[0];

    console.log(partyType);
    return (
        <CategoriesSelector partyType={partyType} />
    );
}