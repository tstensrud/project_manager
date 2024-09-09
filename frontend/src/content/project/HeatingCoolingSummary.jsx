import useFetch from '../../hooks/useFetch'
import HeatingIcon from '../../assets/svg/heatingIcon.svg?react';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';

function HeatingSummary({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/energy/`)
    
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
                                <div className="content-card-inner-container">
                                    <div className="grey-text mb-10">
                                        <h4>Prosjektert varmetap</h4>
                                    </div>
                                    <div className="mb-20">
                                        {data && ((data.heating_data / 1000).toFixed(2)).toLocaleString()} kW
                                    </div>
                                    <div className="grey-text mb-10">
                                        <h4>Tilført kjøling</h4>
                                    </div>
                                    <div>
                                        {data && ((data.cooling_data / 1000).toFixed(2)).toLocaleString()} kW
                                    </div>
                                </div>
                            </>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default HeatingSummary;