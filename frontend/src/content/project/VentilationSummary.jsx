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
                        data && data.systems_data && data.ventdata ? (
                            <>
                                <h4>Systemer</h4>
                                <p className="info">
                                    <ul>
                                        {systemsData && systemsData !== undefined && systemsData.systems_data.map((system, index) => <li key={index}>{system.SystemName}</li>)}
                                    </ul>
                                </p>
                                <h4>Prosjektert luftmengde</h4>
                                {data && data.ventdata.toLocaleString()} m<sup>3</sup>/h
                            </>

                        ) : (
                            <>Ingen data enda</>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default VentilationSummary;