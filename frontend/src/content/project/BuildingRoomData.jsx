// Hooks
import useFetch from '../../hooks/useFetch';

// Components
import LoadingSpinner from '../../layout/LoadingSpinner';
import BuildingIcon from '../../assets/svg/buildingIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import ContentCard from '../../layout/ContentCard';

function BuildingRoomData({ projectId }) {
    const { data, loading, error } = useFetch(`/project_api/${projectId}/buildings/`);

    return (
        <>
            <ContentCard>
                <CardTitle svg={<BuildingIcon />} title="Bygnings- og romdata" />
                <div className="border-0 p-3 rounder-lg">
                    {
                        loading && loading === true ? (
                            <LoadingSpinner />

                        ) : (
                            <>
                                {
                                    data?.building_data ? (
                                        <>
                                            <div className="text-grey-text mb-1">
                                                <h4>Bygg og areal</h4>
                                            </div>
                                            <div className="mb-10">
                                                {
                                                    data?.building_data.map((building, index) => (
                                                        <div key={index} className="flex flex-row">
                                                            <div className="flex w-1/2">
                                                                {building.BuildingName}
                                                            </div>
                                                            <div className="flex flex-1">
                                                                {building.area.toLocaleString()} m<sup>2</sup>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="text-grey-text mb-1">
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
            </ContentCard>
        </>
    );
}

export default BuildingRoomData;