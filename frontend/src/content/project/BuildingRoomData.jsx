import useFetch from '../../hooks/useFetch';
import LoadingSpinner from '../../layout/LoadingSpinner';
import BuildingIcon from '../../assets/svg/buildingIcon.svg?react';
import CardTitle from '../../layout/CardTitle';

function BuildingRoomData({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/buildings/`);

    return (
        <>
            <div className="content-card">
                <div className="content-card-container">
                    <CardTitle svg={<BuildingIcon />} title="Bygnings- og romdata" />
                    <div className="content-card-inner-container">
                        {
                            loading && loading === true ? (
                                <LoadingSpinner />

                            ) : (
                                <>
                                    {
                                        data && data.building_data !== null && data.building_data !== undefined ? (
                                            <>
                                                <div style={{ marginBottom: "10px" }} className="grey-text">
                                                    <h4>Bygg og areal</h4>
                                                </div>
                                                <div style={{ marginBottom: "20px" }}>
                                                    {
                                                        data && data.building_data.map((building, index) => (
                                                            <>
                                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                                    <div style={{ display: "flex", width: "50%" }}>
                                                                        {building.BuildingName}
                                                                    </div>
                                                                    <div style={{ display: "flex", flex: "1" }}>
                                                                        {building.area.toLocaleString()} m<sup>2</sup>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                </div>
                                                <div style={{ marginBottom: "10px" }} className="grey-text">
                                                    <h4>Antall rom prosjektert</h4>
                                                </div>
                                                <div>
                                                    {data && data.rooms}
                                                </div>

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
            </div>
        </>
    );
}

export default BuildingRoomData;