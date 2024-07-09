import useFetch from '../../hooks/useFetch'

function VentilationSummary({projectId}) {
    const {data: systemsData, loading, error} = useFetch(`/project_api/${projectId}/systems/`)
    const {data} = useFetch(`/project_api/${projectId}/ventilation/`)
    
    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    <h2 className="card-title">Ventilasjonsdata</h2>
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
                                {data.ventdata ? data.ventdata.toLocaleString() : "Ingen data"} m<sup>3</sup>/h
                            </>
                        ) : (<>Ingen data enda</>)}
                </div>
            </div>
        </>
    );
}

export default VentilationSummary;