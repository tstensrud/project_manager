import { GlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import useFetch from '../../hooks/useFetch'

import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/ventSystemIcon.jsx';
import SystemsTableRowComponent from "./SystemsTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import LoadingSpinner from '../../layout/LoadingSpinner';
import HelpBox from './HelpBox';
import MainContentContainer from '../../layout/MainContentContainer.jsx';

function VentSystems() {
    const { projectId } = useParams();
    const { setActiveProject } = useContext(GlobalContext);

    // Hooks
    const { data: receivedSystemsData, loading: systemsLoading, error: systemsError, refetch: systemsRefetch } = useFetch(`/project_api/${projectId}/systems/`);

    // States
    const [childMessage, setChildMessage] = useState('');

    // Handlers
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

            <MainContentContainer>

                {childMessage && <MessageBox message={childMessage} />}
                {
                    systemsLoading && systemsLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>

                            <div className="flex w-full align-center justify-center mb-20">

                            </div>
                            {
                                receivedSystemsData ? (
                                    receivedSystemsData.systems_data === null ? (
                                        <>Ingen ssytemer lagt til</>
                                    ) : (
                                        <>
                                            <TableTop info={<HelpBox />} />
                                            <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5">
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
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default VentSystems;