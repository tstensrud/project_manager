import useFetch from '../../hooks/useFetch'
import VentIcon from '../../assets/svg/ventSystemIcon.svg?react';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';

function VentilationSummary({ projectId }) {
    const { data: systemsData, loading, error } = useFetch(`/project_api/${projectId}/systems/`)
    const { data } = useFetch(`/project_api/${projectId}/ventilation/`)
    console.log(systemsData)
    return (
        <>
            <div className="content-card">
                <div className="content-card-container">
                    <CardTitle svg={<VentIcon />} title="Ventilasjonsdata" />
                    {
                        loading && loading === true ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {
                                    systemsData && data ? (
                                        <>
                                            <h4>Systemer</h4>
                                            <ul>
                                                {systemsData.systems_data && systemsData.systems_data.map((system, index) => (
                                                    <li key={index}>{system.SystemName}</li>
                                                ))}
                                            </ul>
                                            <h4>Prosjektert luftmengde</h4>
                                            {
                                                data.ventdata ? (
                                                    <>
                                                        <div style={{ display: "flex", width: "100%", flexDirection: "row" }}>
                                                            {data.ventdata.toLocaleString()} m<sup>3</sup>/h
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>"Ingen data"</>
                                                )}
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
            </div>
        </>
    );
}

export default VentilationSummary;