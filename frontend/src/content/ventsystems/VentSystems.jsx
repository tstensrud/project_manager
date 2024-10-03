import { useParams } from 'react-router-dom';

// Hooks
import useFetch from '../../hooks/useFetch'

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/ventSystemIcon.jsx';
import SystemsTableRowComponent from "./SystemsTableRowComponent";
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import LoadingSpinner from '../../layout/LoadingSpinner';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import Table from '../../layout/tableelements/Table.jsx';

// help
import { title, sections } from '../help/VentsystemsHelp.jsx'

function VentSystems() {
    const { projectId } = useParams();

    // Hooks
    const { data: receivedSystemsData, loading: systemsLoading, error: systemsError, refetch: systemsRefetch } = useFetch(`/project_api/${projectId}/systems/`);
    
    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Ventilasjonssytemer"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {
                    systemsLoading ? (
                        <LoadingSpinner text="ventilasjonssystemer" />
                    ) : (
                        receivedSystemsData?.success === true ? (
                            <>
                                <div className="flex w-full align-center justify-center mb-20">

                                </div>

                                <TableTop title={title} sections={sections} />
                                <TableHeader>
                                    <TableTHelement width="2%" text="#" />
                                    <TableTHelement width="5%" text="Systemnr" />
                                    <TableTHelement width="10%" text="Plassering" />
                                    <TableTHelement width="10%" text="Betjeningsområde" />
                                    <TableTHelement width="7%">Viftekapasitet<br /> m<sup>3</sup>/h</TableTHelement>
                                    <TableTHelement width="5%" text="Gjenvinner" />
                                    <TableTHelement width="7%">Prosjektert tilluft<br /> m<sup>3</sup>/h</TableTHelement>
                                    <TableTHelement width="7%">Prosjektert avtrekk<br /> m<sup>3</sup>/h</TableTHelement>
                                    <TableTHelement width="5%" text="Spesialsystem" />
                                    <TableTHelement width="32%" text="Merknad" />
                                    <TableTHelement width="10%" text="Slett system" />
                                </TableHeader>
                                <Table>
                                    <tbody>
                                        {
                                            receivedSystemsData?.data && (
                                                Object.keys(receivedSystemsData.data).map((system) => <SystemsTableRowComponent systemsRefetch={systemsRefetch} key={receivedSystemsData.data[system].uid} cols={11} systemId={receivedSystemsData.data[system].uid} />)
                                            )
                                        }
                                    </tbody>
                                </Table>

                            </>
                        ) : (
                            <div className="flex w-full h-full justify-center text-center items-center">
                                {receivedSystemsData?.message} {systemsError}
                            </div>
                        )
                    )
                }

            </MainContentContainer>
        </>
    );
}

export default VentSystems;