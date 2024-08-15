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

function VentSystems () {
    const {projectId} = useParams();
    const {setActiveProject} = useContext(GlobalContext);

    // Hooks
    const {data: receivedSystemsData, loading: systemsLoading, error: systemsError, refetch: systemsRefetch} = useFetch(`/project_api/${projectId}/systems/`);
    const {data: systemData, response: systemResponse, setData: setSystemData, handleSubmit: submitSystemData} = useSubmitData(`/project_api/${projectId}/new_system/`);
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
            {systemResponse && systemResponse.error && systemResponse.error !== null ? (<MessageBox message={systemResponse.error} /> ) : (<></>)}
            { childMessage && <MessageBox message={childMessage} />}

            <div className="split-container-left">
                <form id="system" onSubmit={handleSubmitNewSystem} role="form">
                    Systemnummer <br />
                    <input type="text" onChange={handleFormChange} name="systemNumber" className='input-medium' placeholder="Systemnummer" tabIndex="1" required />
                    <br />
                    <br />
                    Aggregatplassering <br />
                    <input type="text" onChange={handleFormChange} name="placement" className='input-medium' placeholder="Plassering" tabIndex="2" required />
                    <br />
                    <br />
                    Betjeningsområde <br />
                    <input type="text" onChange={handleFormChange} name="serviceArea" className='input-medium'placeholder="Betjeningsområde" tabIndex="3" />
                    <br />
                    <br />
                    Viftekapasitet m<sup>3</sup>/h <br />
                    <input type="text" onChange={handleFormChange} name="airflow" className='input-medium' placeholder="Luftmengde" tabIndex="4" />
                    <br />
                    <br />
                    <select  onChange={handleFormChange} name="heat_exchange" tabIndex="5">
                        <option value="none">- Gjenvinner -</option>
                        <option value="R">Roterende</option>
                        <option value="P">Plate/kryss</option>
                        <option value="B">Batteri</option>
                        <option value="0">Ingen</option>
                    </select>
                    <br />
                    <br />
                    Spesialsystem 
                    <input type="checkbox" onChange={handleCheckBoxChange} name="special_system" tabIndex="6" />
                    <br />
                    <button className="form-button" tabIndex="7">Legg til</button>
                </form>
            </div>
            <div className="split-container-right">
                {
                    receivedSystemsData ? (
                        receivedSystemsData.systems_data === null ? (
                            <>Ingen ssytemer lagt til</>
                        
                    ) : (
                        <>
                        <TableTop />
                    <div className="table-wrapper">
                        <table className="fl-table">
                            <thead>
                                 <th width="2%">#</th>
                                 <th width="5%">Systemnr</th>
                                 <th width="10%">Plassering</th>
                                 <th width="10%">Betjeningsområde</th>
                                 <th width="7%">Viftekapasitet<br/> m<sup>3</sup>/h</th>
                                 <th width="5%">Gjenvinner</th>
                                 <th width="7%">Prosjektert tilluft<br/> m<sup>3</sup>/h</th>
                                 <th width="7%">Prosjektert avtrekk<br/> m<sup>3</sup>/h</th>
                                 <th width="5%">Spesialsystem</th>
                                 <th width="32%">Merknad</th>
                                 <th width="10%">Slett system</th>
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
                ) : (<>Loading...</>)
                }
            </div>
    </div>
</>
    );
}

export default VentSystems;