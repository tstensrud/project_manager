import useFetch from '../../hooks/useFetch'

function HeatingSummary({projectId}) {
    const {data, loading, error} = useFetch(`/project_api/${projectId}/heating/`)

    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    <h2 className="card-title">Varmedata- og kjøledata</h2>
                    <h4>Prosjektbeskrivelse</h4>
                    <p className="info">Tekst</p>

                    <p className="info">Prosjektert varmetap<br />
                        {data && ((data.heating_data / 1000).toFixed(0)).toLocaleString()} kW
                    </p>
                </div>
            </div>
        </>
    );
}

export default HeatingSummary;