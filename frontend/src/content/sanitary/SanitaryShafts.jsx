import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch.jsx'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import TableTop from '../../layout/TableTop.jsx';
import SanitaryShaftTableRowComponent from './SanitaryShaftTableRowComponent.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBoxShafts from './HelpBoxShafts.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";

function SanitaryShafts() {
    const { projectId } = useParams();

    // Initial fetch of data
    const { data: buildingData, loading: buildingDataLoading } = useFetch(`/project_api/${projectId}/sanitary/buildings/`);

    //console.log(buildingData);
    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitærsjakter"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="overflow-y-hidden flex justify-center items-center mr-5 ml-5 h-32 no-print">

                </div>

                {
                    buildingDataLoading && buildingDataLoading === true ? (
                        <div className="flex-container-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <TableTop info={<HelpBoxShafts />} />
                            <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">
                                <Table>
                                    <thead>
                                        <tr>
                                            <TableTHelement width="10%">Bygg</TableTHelement>
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
                                    <tbody>
                                        {
                                            buildingData && buildingData.building_data.map((building, buildingIndex) => (
                                                Object.keys(building.shaft_summaries).map((shaft, shaftIndex) => (
                                                    <React.Fragment key={shaftIndex}>
                                                        {building.floors.map((floor, floorIndex) => {
                                                            const summary = building.shaft_summaries[shaft][floor] || {};
                                                            return (
                                                                <SanitaryShaftTableRowComponent key={`${buildingIndex}-${shaftIndex}-${floorIndex}`} data={summary} shaft={shaft} floor={floor} name={building.BuildingName} />
                                                            );
                                                        })}
                                                        <tr key={buildingIndex}>
                                                            <TableTHelement width="10%" />
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
                                                    </React.Fragment>
                                                ))
                                            ))
                                        }
                                    </tbody >
                                </Table>
                            </div>
                        </>
                    )}

            </MainContentContainer>

        </>
    );
}

export default SanitaryShafts;