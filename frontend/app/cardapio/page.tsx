
import PartyTypeCard from '@/components/meaplan/party-type-card';
import { getStrapiData } from '@/lib/utils';


export default async function CardapioPage() {
    const query = '/api/party-types?populate[backgroundImage][fields][0]=url&populate[categories][fields][0]=title&populate[categories][fields][1]=description';
    const { data } = await getStrapiData(query);

    return (
        <>

            <section className="relative z-10 w-full py-12 md:py-24 lg:py-32 xl:py-48 min-h-screen  bg-white "
            >
                <ul className="container px-4 md:px-6 mx-auto  ">
                    <div >

                        <h2 className="text-2xl w-full text-center font-semibold mb-4  xl:text-5xl">Qual festa você deseja contratar?</h2>
                        <div className="gap-4 grid lg:grid-cols-2 mt-20">
                            {data.map((item: any, index: any) =>
                                <PartyTypeCard key={index} {...item} />
                            )}
                        </div>
                    </div>
                </ul>
            </section>
        </>
    );
}
