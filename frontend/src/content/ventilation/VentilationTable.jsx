import React, { useEffect, useState } from 'react';

// Hooks and utils
import useFetch from '../../hooks/useFetch'
import { customSortFloors } from '../../utils/customSortFloors.js'

//Components
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableTDFooter from "../../layout/tableelements/TableTDFooter.jsx";
import TableFooter from '../../layout/tableelements/TableFooter.jsx'
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import TableWrapper from "../../layout/tableelements/TableWrapper.jsx";
import VentilationTableRowComponent from "./VentilationTableRowComponent";
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import TableTop from '../../layout/TableTop';

// help
import { title, sections } from '../help/VentilationTableHelp.jsx';

function VentilationTable({ projectId, buildingUid }) {

    const { data: roomData, loading } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: ventSystemData, loading: ventSystemDataLoading } = useFetch(`/project_api/${projectId}/systems/`);
    const { data: buildingData, refetch: buildingReFetch, loading: buildingDataLoading } = useFetch(`/project_api/${projectId}/ventilation/building_data/${buildingUid}/`);

    const [floors, setFloors] = useState([]);
    const [collapseAll, setCollapseAll] = useState(true);

    useEffect(() => {
        if (buildingData?.success === true) {
            const floorSummaryKeys = Object.keys(buildingData?.data?.floor_summaries);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingData]);

    return (
        <>
            {
                loading ? (
                    <LoadingSpinner text="rom" />
                ) : (
                    <>
                        <TableTop collapseAll={collapseAll} setCollapseAll={setCollapseAll} title={title} sections={sections} />
                        <TableContainer>
                            <TableHeader>
                                <TableTHelement width="2%" text="#" />
                                <TableTHelement width="10%" text="Rom" />
                                <TableTHelement width="6%">Sum personer<br />m³/h</TableTHelement>
                                <TableTHelement width="6%">Sum emisjon<br /> m³/h</TableTHelement>
                                <TableTHelement width="6%">Prosess <br />m³/h </TableTHelement>
                                <TableTHelement width="6%">Dimensjonert<br /> m³/h</TableTHelement>
                                <TableTHelement width="6%">Tilluft<br /> m³/h</TableTHelement>
                                <TableTHelement width="6%">Avtrekk<br /> m³/h</TableTHelement>
                                <TableTHelement width="6%">m³/m²</TableTHelement>
                                <TableTHelement width="6%">Min m³/h</TableTHelement>
                                <TableTHelement width="6%" text="System" />
                                <TableTHelement width="34%" text="Merknad" />
                            </TableHeader>
                            {
                                floors && floors.map((floor, floorIndex) => (
                                    <React.Fragment key={floor}>
                                        <TableWrapper collapseAll={collapseAll} floor={floor}>
                                            <tbody>
                                                {
                                                    roomData?.data &&
                                                    Object.entries(roomData.data)
                                                        .filter(([key, room]) => room.Floor === floor)
                                                        .sort(([, roomA], [, roomB]) => {
                                                            return roomA.RoomNumber.localeCompare(roomB.RoomNumber, undefined, {
                                                                numeric: true,
                                                                sensitivity: "base"
                                                            });
                                                        })
                                                        .map(([key, room], rowIndex) => (
                                                            <VentilationTableRowComponent index={rowIndex} buildingReFetch={buildingReFetch} key={room.uid} allRoomData={room} totalColumns={12} roomId={room.uid} systems={ventSystemData} />
                                                        )
                                                        )
                                                }

                                                <tr className="bg-secondary-color dark:bg-dark-secondary-color">
                                                    <TableTDelement width="2%" />
                                                    <TableTDelement width="10%" />
                                                    <TableTDelement width="6%" />
                                                    <TableTDelement width="6%" />
                                                    <TableTDelement width="6%" />
                                                    <TableTDelement width="6%">
                                                        {
                                                            buildingData?.data?.floor_summaries &&
                                                            Object.keys(buildingData?.data.floor_summaries)
                                                                .filter(key => key === floor)
                                                                .map(key => (
                                                                    <React.Fragment key={key}>
                                                                        <span className="font-bold">
                                                                            {Number(buildingData.data.floor_summaries[key].demand.toFixed(0)).toLocaleString()}
                                                                            <br /> m<sup>3</sup>/h
                                                                        </span>
                                                                    </React.Fragment>
                                                                ))
                                                        }

                                                    </TableTDelement>
                                                    <TableTDelement width="6%">
                                                        {
                                                            buildingData?.data?.floor_summaries &&
                                                            Object.keys(buildingData?.data.floor_summaries)
                                                                .filter(key => key === floor)
                                                                .map(key => (
                                                                    <React.Fragment key={key}>
                                                                        <span className="text-supply-color font-bold">
                                                                            {Number(buildingData.data.floor_summaries[key].supply.toFixed(0)).toLocaleString()}
                                                                            <br /> m<sup>3</sup>/h
                                                                        </span>
                                                                    </React.Fragment>
                                                                ))
                                                        }
                                                    </TableTDelement>
                                                    <TableTDelement width="6%">
                                                        {
                                                            buildingData?.data?.floor_summaries &&
                                                            Object.keys(buildingData?.data.floor_summaries)
                                                                .filter(key => key === floor)
                                                                .map(key => (
                                                                    <React.Fragment key={key}>
                                                                        <span className="text-extract-color font-bold">
                                                                            {Number(buildingData.data.floor_summaries[key].extract.toFixed(0)).toLocaleString()}
                                                                            <br /> m<sup>3</sup>/h
                                                                        </span>
                                                                    </React.Fragment>
                                                                ))
                                                        }

                                                    </TableTDelement>
                                                    <TableTDelement width="6%" />
                                                    <TableTDelement width="6%" />
                                                    <TableTDelement width="6%" />
                                                    <TableTDelement width="34%">
                                                        <div className="flex flex-row w-full">
                                                            <div className="text-start animate-fade w-44">

                                                            </div>
                                                            <div>
                                                                {
                                                                    buildingData?.data?.floor_summaries &&
                                                                    Object.keys(buildingData?.data.floor_summaries)
                                                                        .filter(key => key === floor)
                                                                        .map(key => (
                                                                            <React.Fragment key={key}>
                                                                                <div className="font-semibold">
                                                                                    {buildingData.data.floor_summaries[key].supply < buildingData.data.floor_summaries[key].demand && 'For lite luftmengde ift dimensjonert. '}
                                                                                    {buildingData.data.floor_summaries[key].supply !== buildingData.data.floor_summaries[key].extract && 'Ubalanse i etasje.'}
                                                                                </div>
                                                                            </React.Fragment>
                                                                        ))
                                                                }
                                                            </div>
                                                        </div>

                                                    </TableTDelement>
                                                </tr>
                                            </tbody>
                                        </TableWrapper>
                                    </React.Fragment>
                                ))
                            }
                        </TableContainer>
                        <TableFooter>
                            <TableTDFooter width="2%" />
                            <TableTDFooter width="10%">
                                <strong>Sum</strong>
                            </TableTDFooter>
                            <TableTDFooter width="6%" />
                            <TableTDFooter width="6%" />
                            <TableTDFooter width="6%" />
                            <TableTDFooter width="6%">
                                <strong>{buildingData?.data?.demand && <>{Number((buildingData?.data).demand.toFixed(0)).toLocaleString()} <br /> m<sup>3</sup>/h</>}</strong>
                            </TableTDFooter>
                            <TableTDFooter width="6%">
                                <strong>{buildingData?.data?.supplyAir && <>{Number((buildingData?.data.supplyAir).toFixed(0)).toLocaleString()} <br /> m<sup>3</sup>/h</>}</strong>
                            </TableTDFooter>
                            <TableTDFooter width="6%">
                                <strong>{buildingData?.data?.extractAir && <>{Number((buildingData?.data.extractAir).toFixed(0)).toLocaleString()} <br /> m<sup>3</sup>/h</>}</strong>
                            </TableTDFooter>
                            <TableTDFooter width="6%" />
                            <TableTDFooter width="6%" />
                            <TableTDFooter width="6%" />
                            <TableTDFooter width="34%" />
                        </TableFooter>
                    </>
                )
            }

        </>
    );
}

export default VentilationTable;