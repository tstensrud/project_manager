import useFetch from '../../hooks/useFetch'
import HeatingIcon from '../../assets/svg/heatingIcon.svg?react';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';

function HeatingSummary({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/heating/`)

    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    {
                        loading && loading === true ? (
                            <>
                                <LoadingSpinner />
                            </>
                        ) : (
                            <>
                                <CardTitle svg={<HeatingIcon />} title="Varme- og kjøledata" />
                                <h4>Prosjektbeskrivelse</h4>
                                <p className="info">Tekst</p>

                                <p className="info">Prosjektert varmetap<br />
                                    {data && ((data.heating_data / 1000).toFixed(0)).toLocaleString()} kW
                                </p>
                            </>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default HeatingSummary;