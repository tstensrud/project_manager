import { GlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'

import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/ventSystemIcon.svg?react';
import SystemsTableRowComponent from "./SystemsTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import LoadingSpinner from '../../layout/LoadingSpinner';
import HelpBox from './HelpBox';

function VentSystems() {
    const { projectId } = useParams();
    const { setActiveProject } = useContext(GlobalContext);

    // Hooks
    const { data: receivedSystemsData, loading: systemsLoading, error: systemsError, refetch: systemsRefetch } = useFetch(`/project_api/${projectId}/systems/`);
    const { data: systemData, response: systemResponse, setData: setSystemData, handleSubmit: submitSystemData } = useSubmitData(`/project_api/${projectId}/new_system/`);

    // States
    const [childMessage, setChildMessage] = useState('');

    // Handlers
    const handleFormChange = (e) => {
        setSystemData({
            ...systemData,
            [e.target.name]: e.target.value,
        })
    }

    const handleCheckBoxChange = (e) => {
        setSystemData({
            ...systemData,
            [e.target.name]: e.target.checked,
        })
    }

    const handleSubmitNewSystem = async (e) => {
        e.preventDefault();

        await submitSystemData(e);
        systemsRefetch();
    }

    const handleChildMessage = (msg) => {
        if (msg === "deleted") {
            systemsRefetch();
        }
        else if (msg !== undefined) {
            setChildMessage(msg);
        }
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Ventilasjonssytemer"} projectName={""} projectNumber={""} />

            <div className="main-content">
                {systemResponse && systemResponse.error && systemResponse.error !== null ? (<MessageBox message={systemResponse.error} />) : (<></>)}
                {childMessage && <MessageBox message={childMessage} />}
                {
                    systemsLoading && systemsLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <div style={{ display: "flex" }}>
                            <div className="split-container-left">
                                <form id="system" onSubmit={handleSubmitNewSystem} role="form">
                                    <div className="input-container">
                                        <input className="input-container-input" onChange={handleFormChange} name="systemNumber" type="text" tabIndex="1" placeholder="360.001" required />
                                        <label for="input-field" className="input-label-left">Systemnummer</label>
                                    </div>

                                    <div className="input-container">
                                        <input className="input-container-input" onChange={handleFormChange} name="placement" type="text" tabIndex="2" required />
                                        <label for="input-field" className="input-label-left">Aggregatplassering</label>
                                    </div>

                                    <div className="input-container">
                                        <input className="input-container-input" onChange={handleFormChange} name="serviceArea" type="text" tabIndex="3" required />
                                        <label for="input-field" className="input-label-left">Betjeningsområde</label>
                                    </div>

                                    <div className="input-container">
                                        <input className="input-container-input" onChange={handleFormChange} name="airflow" type="text" tabIndex="4" required />
                                        <label for="input-field" className="input-label-left">Viftekapasitet m<sup>3</sup>/h <br /></label>
                                    </div>
                                    <p>
                                        <select onChange={handleFormChange} name="heat_exchange" tabIndex="5">
                                            <option value="none">- Gjenvinner -</option>
                                            <option value="R">Roterende</option>
                                            <option value="P">Plate/kryss</option>
                                            <option value="B">Batteri</option>
                                            <option value="0">Ingen</option>
                                        </select>
                                    </p>
                                    <p style={{ display: "flex", textAlign: "center", alignItems: "center" }}>
                                        Spesialsystem&nbsp;
                                        <input type="checkbox" onChange={handleCheckBoxChange} name="special_system" tabIndex="6" />
                                    </p>

                                    <p>
                                        <button className="form-button" tabIndex="7">Legg til</button>
                                    </p>

                                </form>
                            </div>
                            <div className="split-container-right">
                                {
                                    receivedSystemsData ? (
                                        receivedSystemsData.systems_data === null ? (
                                            <>Ingen ssytemer lagt til</>
                                        ) : (
                                            <>
                                                <TableTop info={<HelpBox />} />
                                                <div className="table-wrapper">
                                                    <table className="fl-table">
                                                        <thead>
                                                            <tr>
                                                                <th width="2%">#</th>
                                                                <th width="5%">Systemnr</th>
                                                                <th width="10%">Plassering</th>
                                                                <th width="10%">Betjeningsområde</th>
                                                                <th width="7%">Viftekapasitet<br /> m<sup>3</sup>/h</th>
                                                                <th width="5%">Gjenvinner</th>
                                                                <th width="7%">Prosjektert tilluft<br /> m<sup>3</sup>/h</th>
                                                                <th width="7%">Prosjektert avtrekk<br /> m<sup>3</sup>/h</th>
                                                                <th width="5%">Spesialsystem</th>
                                                                <th width="32%">Merknad</th>
                                                                <th width="10%">Slett system</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                receivedSystemsData && receivedSystemsData.systems_data ? (
                                                                    receivedSystemsData.systems_data.map((system) => <SystemsTableRowComponent msgToParent={handleChildMessage} key={system.uid} systemId={system.uid} />)
                                                                ) : (
                                                                    <></>
                                                                )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )
                                    ) : (<></>)
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        </>
    );
}

export default VentSystems;