import useFetch from '../../hooks/useFetch'

function BuildingRoomData({projectId}) {
    const {data, loading, error} = useFetch(`/project_api/${projectId}/buildings/`)
    return (
        <>
            <div className="cards">
                <div className="information [ card ]">
                    <h2 className="card-title">Bygnings- og romdata</h2>
                    <h4>Bygg</h4>
                    <p className="info">
                    <ul>
                        {data && data.building_data.map((building,index) => (<li key={index}>{building.BuildingName}</li>))}
                    </ul>
                    </p>
                    <h4>Rom</h4>
                    <p className="info">Antall rom prosjektert:<br/>
                    {data && data.rooms}
                    </p>
                </div>
            </div>
        </>
    );
}

export default BuildingRoomData;