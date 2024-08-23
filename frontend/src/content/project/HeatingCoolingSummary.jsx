import useFetch from '../../hooks/useFetch'
import HeatingIcon from '../../assets/svg/heatingIcon.svg?react';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';

function HeatingSummary({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/energy/`)
    console.log(data)
    return (
        <>
            <div className="content-card">
                <div className="content-card-container">
                    {
                        loading && loading === true ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <CardTitle svg={<HeatingIcon />} title="Varme- og kjøledata" />
                                <h4>Prosjektert varmetap</h4>
                                <p className="info">
                                    {data && ((data.heating_data / 1000).toFixed(2)).toLocaleString()} kW
                                </p>
                                <h4>Tilført kjøling</h4>
                                <p>
                                {data && ((data.cooling_data / 1000).toFixed(2)).toLocaleString()} kW
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