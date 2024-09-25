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
import TableWrapper from "../../layout/tableelements/TableWrapper.jsx";
import SanitaryTableRowComponent from "./SanitaryTableRowComponent.jsx";
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import TableTop from '../../layout/TableTop.jsx';

// help
import { title, sections } from '../help/SanitaryEquipmentHelp.jsx'

function SanitaryEquipmentTable({ projectId, buildingUid }) {
    const { data: roomData, loading } = useFetch(`/project_api/${projectId}/rooms/building/${buildingUid}/`);
    const { data: buildingData, loading: buildingDataLoading, refetch: buildingReFetch } = useFetch(`/project_api/${projectId}/sanitary/get_building/${buildingUid}/`);

    const [floors, setFloors] = useState([]);

    useEffect(() => {
        if (buildingData?.success === true) {
            const floorSummaryKeys = Object.values(buildingData?.data?.floors);
            const sortedKeys = customSortFloors(floorSummaryKeys);
            setFloors(sortedKeys);
        }
    }, [buildingData]);


    return (
        <>
            {
                loading ? (
                    <LoadingSpinner text="romdata" />
                ) : (
                    <>
                    <TableTop title={title} sections={sections} />
                    <TableContainer>

                        <TableHeader>
                            <thead>
                                <tr>
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
                                </tr>
                            </thead>
                        </TableHeader>
                        {
                            buildingDataLoading ? (
                                <LoadingSpinner text="utstyr" />
                            ) : (
                                <>
                                    {
                                        floors && floors.map(floor => (
                                            <React.Fragment key={floor}>
                                                <TableWrapper floor={floor}>
                                                    <Table>
                                                        <tbody>
                                                            {
                                                                roomData?.data && (
                                                                    Object.entries(roomData.data)
                                                                        .filter(([key, room]) => room.Floor === floor)
                                                                        .sort(([, roomA], [, roomB]) => {
                                                                            return roomA.RoomNumber.localeCompare(roomB.RoomNumber, undefined, {
                                                                                numeric: true,
                                                                                sensitivity: "base"
                                                                            });
                                                                        })
                                                                        .map(([key, room]) => (
                                                                            <SanitaryTableRowComponent buildingReFetch={buildingReFetch} key={room.uid} totalColumns={14} roomId={room.uid} />
                                                                        )
                                                                        )
                                                                )
                                                            }
                                                        </tbody>
                                                    </Table>
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
                    </>
                )
            }

        </>
    );
}

export default SanitaryEquipmentTable;