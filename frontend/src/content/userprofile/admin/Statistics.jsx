
import useFetch from '../../../hooks/useFetch'

import LoadingSpinner from '../../../layout/LoadingSpinner';

function Statistics() {
    const { data, loading, error, refetch } = useFetch(`/projects/stats/`);

    return (
        <>
            {
                loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="w-1/3 flex flex-col">

                        <div className="flex flex-row w-full">
                            <div className="w-1/2">
                                Antall prosjekter
                            </div>
                            <div className="flex flex-1 text-end">
                                {data?.success === true && data.data.total_projects} prosjekter
                            </div>
                        </div>

                        <div className="flex flex-row w-full">
                            <div className="w-1/2">
                                Totalt kvadratmeter prosjektert
                            </div>
                            <div className="flex flex-1 text-end">
                                {data?.success === true && data.data.total_area.toLocaleString()} <div className="ml-1">m<sup>2</sup></div>
                            </div>
                        </div>

                        <div className="flex flex-row w-full">
                            <div className="w-1/2">
                                Antall rom
                            </div>
                            <div className="flex flex-1 text-end">
                                {data?.success === true && data.data.total_rooms} rom
                            </div>
                        </div>

                    </div>
                )
            }
        </>
    );
}

export default Statistics;