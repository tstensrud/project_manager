import useFetch from '../../hooks/useFetch.jsx'
import React, { useState } from "react";

import SanitaryShaftTableRowComponent from './SanitaryShaftTableRowComponent.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import TableWrapper from "../../layout/tableelements/TableWrapper.jsx";
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import TableFooter from '../../layout/tableelements/TableFooter.jsx'
import TableTop from '../../layout/TableTop.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx'

//help
import { title, sections } from '../help/SanitaryShaftsHelp.jsx'


function SanitaryShaftTable({ projectId, buildingUid }) {
    const { data: buildingData, loading: buildingDataLoading } = useFetch(`/project_api/${projectId}/sanitary/get_building/${buildingUid}/`);
    const [collapseAll, setCollapseAll] = useState(true);

    return (
        <>
            {
                buildingDataLoading ? (
                    <LoadingSpinner text="sjaktdata" />
                ) : (
                    <>
                        {
                            buildingData?.success ? (
                                <>
                                    <TableTop title={title} sections={sections} collapseAll={collapseAll} setCollapseAll={setCollapseAll} />
                                    <TableContainer>
                                        <TableHeader>
                                            <TableTHelement width="12%">Etasje</TableTHelement>
                                            <TableTHelement width="12%">Kaldtvann <br />(L/s)</TableTHelement>
                                            <TableTHelement width="12%">Varmtvann <br />(L/s)</TableTHelement>
                                            <TableTHelement width="12%">Spillvann<br />(L/s)</TableTHelement>
                                            <TableTHelement width="12%">KV Cu <br />mm</TableTHelement>
                                            <TableTHelement width="12%">VV Cu <br /> mm</TableTHelement>
                                            <TableTHelement width="12%">SPV 1:60 <br />mm</TableTHelement>
                                            <TableTHelement width="12%">SPV Stående <br />mm</TableTHelement>
                                        </TableHeader>
                                        {
                                            buildingData?.data?.shaft_summaries && Object.keys(buildingData.data.shaft_summaries).map((shaft, index) => (
                                                <React.Fragment key={index}>
                                                    <TableWrapper shaft={shaft} collapseAll={collapseAll}>
                                                        <tbody>
                                                            {
                                                                Object.keys(buildingData.data.shaft_summaries[shaft])
                                                                    .sort((a, b) => parseInt(a, 10) - parseInt(b - 10))
                                                                    .map((floor, floorIndex) => (
                                                                        <SanitaryShaftTableRowComponent key={`${floorIndex}-${index}`} shaft={shaft} floor={floor} data={buildingData.data.shaft_summaries[shaft][floor]} />
                                                                    )
                                                                    )
                                                            }
                                                        </tbody>
                                                    </TableWrapper>
                                                </React.Fragment>
                                            ))
                                        }
                                    </TableContainer>
                                    <TableFooter>
                                        <td className="h-6" colspan="8"></td>
                                    </TableFooter>
                                </>
                            ) : (
                                <MessageBox message={`${buildingData?.message ?? 'Feil har oppstått. Gå inn "min side" eller velg prosjekt og åpne prosjektet du vil jobbe med på nytt.'}`} closeable={false} />
                            )
                        }
                    </>
                )
            }
        </>
    );
}

export default SanitaryShaftTable;