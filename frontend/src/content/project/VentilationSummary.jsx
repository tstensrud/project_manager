import useFetch from '../../hooks/useFetch'
import VentIcon from '../../assets/svg/ventSystemIcon.svg?react';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';

function VentilationSummary({ projectId }) {
    const { data: systemsData, loading, error } = useFetch(`/project_api/${projectId}/systems/`)
    const { data } = useFetch(`/project_api/${projectId}/ventilation/`)

    return (
        <>
            <div className="content-card">
                <div className="content-card-container">
                    <CardTitle svg={<VentIcon />} title="Ventilasjonsdata" />
                    <div className="content-card-inner-container">
                        {
                            loading && loading === true ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    {
                                        systemsData && data ? (
                                            <>
                                                <div style={{ marginBottom: "20px" }}>
                                                    <div style={{ marginBottom: "10px" }} className="grey-text">
                                                        <h4>Ventilasjonssystemer</h4>
                                                    </div>
                                                    {systemsData.systems_data && systemsData.systems_data.map((system, index) => (
                                                        <div key={index} style={{ display: "flex", flexDirection: "row" }}>
                                                            <div style={{ display: "flex", width: "100%" }}>
                                                                {system.SystemName}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ marginBottom: "10px" }} className="grey-text">
                                                    <h4>Prosjektert luftmengde</h4>
                                                </div>
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
            </div>
        </>
    );
}

export default VentilationSummary;