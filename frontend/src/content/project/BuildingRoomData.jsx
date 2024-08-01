import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../../layout/LoadingSpinner';

function BuildingRoomData({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/buildings/`)
    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    <h2 className="card-title">Bygnings- og romdata</h2>
                    {
                        loading && loading === true ? (
                            <>
                                <LoadingSpinner />
                            </>
                        ) : (
                            <>
                                {
                                    data && data.building_data !== null && data.building_data !== undefined ? (
                                        <>

                                            <h4>Bygg</h4>
                                            <ul>
                                                {data && data.building_data.map((building, index) => (<li key={index}>{building.BuildingName}</li>))}
                                            </ul>
                                            <h4>Rom</h4>
                                            <p className="info">Antall rom prosjektert:<br />
                                                {data && data.rooms}
                                            </p>
                                        </>
                                    ) : (
                                        <>{data && data.error}</>
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

export default BuildingRoomData;