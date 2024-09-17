import useFetch from '../../hooks/useFetch.jsx'
import React, { useEffect, useState } from "react";

import SanitaryShaftTableRowComponent from './SanitaryShaftTableRowComponent.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';


function SanitaryShaftTable({ projectId, buildingUid }) {
    const { data: buildingData, loading } = useFetch(`/project_api/${projectId}/sanitary/get_building/${buildingUid}/`);

    return (
        <>
            {
                loading ? (
                    <LoadingSpinner text="sjaktdata" />
                ) : (
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <TableTHelement width="10%">Sjakt</TableTHelement>
                                    <TableTHelement width="10%">Etasje</TableTHelement>
                                    <TableTHelement width="10%">Kaldtvann <br />(L/s)</TableTHelement>
                                    <TableTHelement width="10%">Varmtvann <br />(L/s)</TableTHelement>
                                    <TableTHelement width="10%">Spillvann<br />(L/s)</TableTHelement>
                                    <TableTHelement width="10%">KV Cu <br />mm</TableTHelement>
                                    <TableTHelement width="10%">VV Cu <br /> mm</TableTHelement>
                                    <TableTHelement width="10%">SPV 1:60 <br />mm</TableTHelement>
                                    <TableTHelement width="10%">SPV Stående <br />mm</TableTHelement>
                                </tr>
                            </thead>
                            {
                                buildingData?.data?.shaft_summaries && Object.keys(buildingData.data.shaft_summaries).map((shaft, index) => (
                                    <React.Fragment key={index}>
                                        <tbody>
                                            {
                                                Object.keys(buildingData.data.shaft_summaries[shaft])
                                                    .sort((a, b) => parseInt(a, 10) - parseInt(b - 10))
                                                    .map((floor, floorIndex) => (
                                                        <SanitaryShaftTableRowComponent key={`${floorIndex}-${index}`} shaft={shaft} floor={floor} data={buildingData.data.shaft_summaries[shaft][floor]} />
                                                    ))

                                            }
                                            <tr>
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                                <TableTHelement width="10%" />
                                            </tr>
                                        </tbody>
                                    </React.Fragment>
                                ))
                            }
                        </Table>
                    </TableWrapper>
                )
            }

        </>
    );
}

export default SanitaryShaftTable;