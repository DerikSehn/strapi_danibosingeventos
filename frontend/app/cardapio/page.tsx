
import PartyTypeCard from '@/components/meaplan/party-type-card';
import { getStrapiData } from '@/lib/utils';


export default async function CardapioPage() {
    const query = '/api/party-types?populate[backgroundImage][fields][0]=url&populate[categories][fields][0]=title&populate[categories][fields][1]=description';
    const { data } = await getStrapiData(query);

    return (
        <section className="relative z-10 w-full py-12 md:py-24 lg:py-32 xl:py-48 min-h-screen  bg-neutral-900 overflow-hidden "
        >
            {/* <MotionBackgroundZoom src={data?.[0].backgroundImage.url} alt="Hero" /> */}
            <ul className="container px-4 md:px-6 mx-auto relative z-10 ">
                <div >
                    <h2 className="text-2xl w-full text-center font-rustic mb-4 text-primary-800 xl:text-6xl">
                        1º passo: Escolha seu tipo de evento</h2>
                    <div className=" grid lg:grid-cols-2 mt-20 gap-10">
                        {data?.map((item: any) =>
                            <PartyTypeCard key={item.id} {...item} />
                        )}
                    </div>
                </div>
            </ul>
        </section>
    );
}
