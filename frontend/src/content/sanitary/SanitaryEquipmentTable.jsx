import React, { useEffect, useState } from 'react';

// Hooks and utils
import useFetch from '../../hooks/useFetch.jsx'
import { customSortFloors } from '../../utils/customSortFloors.js'

//Components
import Table from '../../layout/tableelements/Table.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from '../../layout/tableelements/TableTDelement.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import TableTDFooter from "../../layout/tableelements/TableTDFooter.jsx";
import TableFooter from '../../layout/tableelements/TableFooter.jsx'
import TableWrapper from "../../layout/tableelements/TableWrapper.jsx";
import SanitaryTableRowComponent from "./SanitaryTableRowComponent.jsx";
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import TableTop from '../../layout/TableTop.jsx';

// help
import { title, sections } from '../help/SanitaryEquipmentHelp.jsx'
import MessageBox from '../../layout/MessageBox.jsx';
import { ERROR_FALLBACK_MSG } from '../../utils/globals.js';

function SanitaryEquipmentTable({ projectId, buildingUid }) {
    const { data: roomData, loading: roomDataLoading, error: roomDataError } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, loading: buildingDataLoading, error: buildingDataError, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/sanitary/get_building/${buildingUid}/`);

    const [floors, setFloors] = useState([]);
    const [collapseAll, setCollapseAll] = useState(true);

    useEffect(() => {
        if (buildingData?.success === true) {
            const floorSummaryKeys = Object.values(buildingData?.data?.floors);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingData]);

    return (
        <>
            {roomDataError && <MessageBox message={roomDataError} closeable={true} />}
            {buildingDataError && <MessageBox message={buildingDataError} closeable={true} />}
            {
                roomDataLoading ? (
                    <LoadingSpinner text="romdata" />
                ) : (
                    <>
                        {
                            roomData?.success && (
                                <>
                                    <TableTop collapseAll={collapseAll} setCollapseAll={setCollapseAll} title={title} sections={sections} />
                                    <TableContainer>

                                        <TableHeader>
                                            <TableTHelement width="2%" text="#" />
                                            <TableTHelement width="12%">Rom</TableTHelement>
                                            <TableTHelement width="5%">Sjakt</TableTHelement>
                                            <TableTHelement width="5%">1/14" servant</TableTHelement>
                                            <TableTHelement width="5%">1" servant</TableTHelement>
                                            <TableTHelement width="5%">Drikkefontene</TableTHelement>
                                            <TableTHelement width="5%">Utslagsvask</TableTHelement>
                                            <TableTHelement width="5%">WC</TableTHelement>
                                            <TableTHelement width="5%">Urinal</TableTHelement>
                                            <TableTHelement width="5%">Oppvaskmaskin</TableTHelement>
                                            <TableTHelement width="5%">Dusjbatteri</TableTHelement>
                                            <TableTHelement width="5%">Badekar</TableTHelement>
                                            <TableTHelement width="5%">Vaskemaskin</TableTHelement>
                                            <TableTHelement width="5%">Tappekran <br />inne</TableTHelement>
                                            <TableTHelement width="5%">Tappekran <br />ute</TableTHelement>
                                            <TableTHelement width="5%">Brannskap</TableTHelement>
                                            <TableTHelement width="5%">Sluk<br />75mm</TableTHelement>
                                            <TableTHelement width="5%">Sluk<br />110mm</TableTHelement>
                                        </TableHeader>
                                        {
                                            buildingDataLoading ? (
                                                <LoadingSpinner text="utstyr" />
                                            ) : (
                                                <>
                                                    {
                                                        floors && floors.map(floor => (
                                                            <React.Fragment key={floor}>
                                                                <TableWrapper collapseAll={collapseAll} floor={floor}>
                                                                    <tbody>
                                                                        {
                                                                            roomData?.data && (
                                                                                Object.keys(roomData.data)
                                                                                    .filter((key, index) => roomData.data[key].roomData.Floor === floor)
                                                                                    .sort((roomA, roomB) => {
                                                                                        return roomData.data[roomA].roomData.RoomNumber.localeCompare(roomData.data[roomB].roomData.RoomNumber, undefined, {
                                                                                            numeric: true,
                                                                                            sensitivity: "base"
                                                                                        });
                                                                                    })
                                                                                    .map((key, index, rowIndex) => (
                                                                                        <SanitaryTableRowComponent buildingReFetch={buildingReFetch} key={index} totalColumns={14} roomData={roomData.data[key]} />
                                                                                    )
                                                                                    )
                                                                            )
                                                                        }
                                                                    </tbody>
                                                                </TableWrapper>
                                                            </React.Fragment>
                                                        ))
                                                    }
                                                </>
                                            )
                                        }

                                        {/*                         <div style={{ marginBottom: "30px" }}>
                            <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color dark:bg-dark-secondary-color shadow-lg shadow-background-shade mb-5">
                                <Table>
                                    <tfoot>
                                        <tr>
                                            <TableTDelement width="2%" />
                                            <TableTDelement width="12%" />
                                            <TableTDelement width="5%" />
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.sink_1_14_inch && <>{Number((buildingData.data).sanitary_summary.sink_1_14_inch)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.sink_large && <>{Number((buildingData.data).sanitary_summary.sink_large)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.drinking_fountain && <>{Number((buildingData.data).sanitary_summary.drinking_fountain)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.sink_utility && <>{Number((buildingData.data).sanitary_summary.sink_utility)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.wc && <>{Number((buildingData.data).sanitary_summary.wc)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.urinal && <>{Number((buildingData.data).sanitary_summary.urinal)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.dishwasher && <>{Number((buildingData.data).sanitary_summary.dishwasher)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.shower && <>{Number((buildingData.data).sanitary_summary.shower)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.tub && <>{Number((buildingData.data).sanitary_summary.tub)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.washing_machine && <>{Number((buildingData.data).sanitary_summary.washing_machine)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.tap_water_outlet_inside && <>{Number((buildingData.data).sanitary_summary.tap_water_outlet_inside)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.tap_water_outlet_outside && <>{Number((buildingData.data).sanitary_summary.tap_water_outlet_outside)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.firehose && <>{Number((buildingData.data).sanitary_summary.firehose)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.drain_75_mm && <>{Number((buildingData.data).sanitary_summary.drain_75_mm)} <br /> stk</>}</strong></TableTDelement>
                                            <TableTDelement width="5%"><strong>{buildingData?.data?.sanitary_summary?.drain_110_mm && <>{Number((buildingData.data).sanitary_summary.drain_110_mm)} <br /> stk</>}</strong></TableTDelement>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </div>
                        </div> */}
                                    </TableContainer>
                                    <TableFooter>
                                        <td className="h-6" colspan="14"></td>
                                    </TableFooter>
                                </>
                            )
                        }
                        {roomData?.success === false && <MessageBox message={roomData?.message ?? ERROR_FALLBACK_MSG} closeable={false} />}
                        {roomDataError && <MessageBox error message={`${roomDataError} @ room data` ?? ERROR_FALLBACK_MSG} closeable={true} />}
                        {buildingDataError && <MessageBox error message={`${buildingDataError} @ building data` ?? ERROR_FALLBACK_MSG} closeable={true} />}
                    </>
                )
            }
        </>
    );
}

export default SanitaryEquipmentTable;