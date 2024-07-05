import useFetch from '../../hooks/useFetch'

function CoolingSummary({projectId}) {
    const {data, loading, error} = useFetch(`/project_api/${projectId}/`)

    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    <h2 className="card-title">Kjøledata</h2>
                    <h4>Prosjektbeskrivelse</h4>
                    <p className="info"> </p>
                    <h4>Oppsummering</h4>
                    <p className="info">Kravspesifikasjon<br />
                        
                    </p>
                    <p className="info">Prosjektert luftmengde<br />
                        m<sup>3</sup>/h
                    </p>
                    <p className="info">Prosjektert varme<br />
                        W
                    </p>
                </div>
            </div>
        </>
    );
}

export default CoolingSummary;