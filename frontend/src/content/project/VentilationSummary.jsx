// Hooks
import useFetch from '../../hooks/useFetch'

// Components
import ContentCard from '../../layout/ContentCard';
import VentIcon from '../../assets/svg/ventSystemIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';

function VentilationSummary({ projectId }) {
    const { data: systemsData, loading, error } = useFetch(`/project_api/${projectId}/systems/`)
    const { data } = useFetch(`/project_api/${projectId}/ventilation/`)

    return (
        <ContentCard>
            <CardTitle svg={<VentIcon />} title="Ventilasjonsdata" />
            <div className="border-0 p-3 rounder-lg">
                {
                    loading && loading === true ? (
                        <LoadingSpinner text="ventilasjonsdata" />
                    ) : (
                        <>
                            {
                                systemsData && data ? (
                                    <>
                                        <div className="mb-10">
                                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                                <h4>Ventilasjonssystemer</h4>
                                            </div>
                                            {systemsData.systems_data && systemsData.systems_data.map((system, index) => (
                                                <div key={index} className="flex flex-row">
                                                    <div className="flex w-full">
                                                        {system.SystemName}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mb-1 text-grey-text dark:text-dark-grey-text">
                                            <h4>Prosjektert luftmengde</h4>
                                        </div>
                                        {
                                            data.ventdata ? (
                                                <>
                                                    <div className="flex flex-row w-full">
                                                        {data.ventdata.toLocaleString()} <div className="ml-1">m<sup>3</sup>/h</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>Ingen data</>
                                            )
                                        }
                                    </>
                                ) : (
                                    <>
                                        Ingen data enda
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>
        </ContentCard>
    );
}

export default VentilationSummary;