import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch.jsx'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import TableTop from '../../layout/TableTop.jsx';
import SanitaryShaftTableRowComponent from './SanitaryShaftTableRowComponent.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner.jsx';
import HelpBoxShafts from './HelpBoxShafts.jsx';

function SanitaryShafts() {
    const { projectId } = useParams();

    // Initial fetch of data
    const { data: buildingData, loading: buildingDataLoading } = useFetch(`/project_api/${projectId}/sanitary/buildings/`);

    //console.log(buildingData);
    return (
        <>
            <SubTitleComponent svg={<TapwaterIcon />} headerText={"Sanitærsjakter"} projectName={""} projectNumber={""} />
            <div className='main-content'>
                <div className="text-container-above-tables no-print">

                </div>

                {
                    buildingDataLoading && buildingDataLoading === true ? (
                        <div className="flex-container-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <TableTop info={<HelpBoxShafts />} />
                            <div className="table-wrapper">
                                <table className="fl-table">
                                    <thead>
                                        <tr>
                                            <th width="10%">Bygg</th>
                                            <th width="10%">Sjakt</th>
                                            <th width="10%">Etasje</th>
                                            <th width="10%">Kaldtvann <br />(L/s)</th>
                                            <th width="10%">Varmtvann <br />(L/s)</th>
                                            <th width="10%">Spillvann<br />(L/s)</th>
                                            <th width="10%">KV Cu <br />mm</th>
                                            <th width="10%">VV Cu <br /> mm</th>
                                            <th width="10%">SPV 1:60 <br />mm</th>
                                            <th width="10%">SPV Stående <br />mm</th>
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
                                                            <td style={{ height: "30px" }}></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))
                                            ))
                                        }
                                    </tbody >
                                </table>
                            </div>
                        </>
                    )}

            </div>

        </>
    );
}

export default SanitaryShafts;