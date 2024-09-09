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
                                        data?.building_data ? (
                                            <>
                                                <div className="grey-text mb--10">
                                                    <h4>Bygg og areal</h4>
                                                </div>
                                                <div className="mb-20">
                                                    {
                                                        data?.building_data.map((building, index) => (
                                                                <div key={index} className="flex flex-row">
                                                                    <div style={{ display: "flex", width: "50%" }}>
                                                                        {building.BuildingName}
                                                                    </div>
                                                                    <div style={{ display: "flex", flex: "1" }}>
                                                                        {building.area.toLocaleString()} m<sup>2</sup>
                                                                    </div>
                                                                </div>
                                                        ))
                                                    }
                                                </div>
                                                <div className="grey-text mb-10">
                                                    <h4>Antall rom prosjektert</h4>
                                                </div>
                                                <div>
                                                    {data?.rooms}
                                                </div>
                                            </>
                                        ) : (
                                            <>{data?.error}</>
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