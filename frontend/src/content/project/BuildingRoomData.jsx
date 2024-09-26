// Components
import BuildingIcon from '../../assets/svg/buildingIcon.jsx';
import CardTitle from '../../layout/CardTitle';
import ContentCard from '../../layout/ContentCard';

function BuildingRoomData({ buildingData }) {
    console.log(buildingData)
    return (
        <ContentCard>
            <CardTitle svg={<BuildingIcon />} title="Bygnings- og romdata" />
            <div className="border-0 p-3 rounder-lg">
                {
                    buildingData ? (
                        <>
                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                <h4>Bygg og areal</h4>
                            </div>
                            <div className="mb-10">
                                {
                                    buildingData && Object.keys(buildingData.building_data).map((building, index) => (
                                        <div key={index} className="flex flex-row w-full">
                                            <div className="flex w-1/2">
                                                {buildingData.building_data[building]?.BuildingName && buildingData.building_data[building].BuildingName}
                                            </div>
                                            <div className="flex w-1/2 justify-end">
                                                {buildingData.building_data[building]?.area && buildingData.building_data[building].area.toLocaleString()} <div className="ml-1">m<sup>2</sup></div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                <h4>Antall rom prosjektert</h4>
                            </div>
                            <div>
                                {buildingData.rooms}
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