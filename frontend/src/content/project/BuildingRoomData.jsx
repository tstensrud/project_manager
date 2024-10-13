// Components
import BuildingIcon from '../../assets/svg/buildingIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import ContentCard from '../../layout/ContentCard';

function BuildingRoomData({ data }) {
    
    return (
        <ContentCard width="24">
            <CardTitle svg={<BuildingIcon />} title="Bygnings- og romdata" />
            <div className="border-0 p-3 rounder-lg">
                {
                    data?.buildingData ? (
                        <>
                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                <h4>Bygg og areal</h4>
                            </div>
                            <div className="mb-10 text-sm">
                                {
                                    data.buildingData && Object.keys(data.buildingData.building_data).map((building, index) => (
                                        <div key={index} className="flex flex-row w-full">
                                            <div className="flex w-1/2">
                                                {data.buildingData.building_data[building]?.BuildingName && data.buildingData.building_data[building].BuildingName}
                                            </div>
                                            <div className="flex w-1/2 justify-end">
                                                {data.buildingData.building_data[building]?.area && data.buildingData.building_data[building].area.toLocaleString()} <div className="ml-1">m<sup>2</sup></div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                <h4>Totalt</h4>
                            </div>
                            <div className="flex flex-col text-sm">
                                <div className="flex flex-row w-full">
                                    <div className="flex w-1/2">
                                        Antall rom:
                                    </div>
                                    <div className="flex w-1/2 justify-end">
                                        {data.buildingData.rooms} stk.
                                    </div>
                                </div>
                                <div className="flex flex-row w-full">
                                    <div className="flex w-1/2">
                                        Totalt kvm:
                                    </div>
                                    <div className="flex w-1/2 justify-end">
                                        {data.area.toLocaleString()} <div>m<sup>2</sup></div>
                                    </div>
                                </div>

                            </div>
                        </>
                    ) : (
                        <>
                            Ingen bygg er lagt til
                        </>
                    )
                }
            </div>
        </ContentCard>
    );
}

export default BuildingRoomData;