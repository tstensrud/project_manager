// Hooks
import useFetch from '../../hooks/useFetch'

// Components
import ContentCard from '../../layout/ContentCard';
import HeatingIcon from '../../assets/svg/heatingIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import LoadingSpinner from '../../layout/LoadingSpinner';
import { useEffect } from 'react';

function HeatingSummary({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/energy/`)

    return (
        <>
        <ContentCard>

                    {
                        loading && loading === true ? (
                            <LoadingSpinner text="varme og kjøledata" />
                        ) : (
                            <>
                                <CardTitle svg={<HeatingIcon />} title="Varme- og kjøledata" />
                                <div className="border-0 p-3 rounder-lg">
                                    <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                        <h4>Prosjektert varmetap</h4>
                                    </div>
                                    <div className="mb-10">
                                        {data && ((data.heating_data / 1000).toFixed(2)).toLocaleString()} kW
                                    </div>
                                    <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                        <h4>Tilført kjøling</h4>
                                    </div>
                                    <div>
                                        {data && ((data.cooling_data / 1000).toFixed(2)).toLocaleString()} kW
                                    </div>
                                </div>
                            </>
                        )
                    }
            </ContentCard>
        </>
    );
}

export default HeatingSummary;