import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Hooks
import useSubmitFile from '../../hooks/useSubmitFile'
import useFetch from '../../hooks/useFetch'

// SVG
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner';
import TableTop from '../../layout/TableTop';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';

// help
import { title, sections } from '../help/SpecificationHelp.jsx'


function Specification() {

    const { suid } = useParams();

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/specifications/get_spec_room_data/${suid}/`);
    const { file, response, error: fileError, setFile, handleSubmit } = useSubmitFile(`/specifications/new_rooms/${suid}/`);

    const [warning, setWarning] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

    }

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        if (!file && file === "") {
            setWarning('Ingen fil valgt.')
            return;
        } else {
            await handleSubmit(e);
            setFile('');
        }
    }

    const handleEditClick = () => {
        navigate(`/specifications/edit/${suid}/${data.spec_name}`)
    }
    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Kravspesifikasjon"} projectName={data && data.spec_name} projectNumber={""} />

            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner text="romtyper" />
                    ) : (
                        <>
                            <div className="overflow-y-hidden flex justify-center items-center pt-5 h-32-spec">
                                <div className='container-flex-col-spec'>
                                    <Link to={`/specifications/${suid}/new_room`}>Legg inn romtyper</Link>
                                </div>
                                <div className="group flex flex-row flex-1 justify-end items-center cursor-pointer text-accent-color dark:text-dark-accent-color hover:text-primary-color hover:dark:text-dark-primary-color transition duration-300">
                                    <div className="pr-3" onClick={handleEditClick}>
                                        Rediger kravspesifikasjon
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-accent-color group-hover:dark:stroke-dark-primary-color group-hover:stroke-primary-color fill-none transition duration-300">
                                            <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
                                            <line x1="3" y1="22" x2="21" y2="22"></line>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <TableTop title={title} sections={sections} setCollapseAll={null} />
                            <TableContainer>
                                <TableHeader>
                                    <TableTHelement width="15%">Romtype</TableTHelement>
                                    <TableTHelement width="5%">Luft per person<br />m<sup>3</sup>/h/pers</TableTHelement>
                                    <TableTHelement width="5%">Emisjon<br />m<sup>3</sup>/m<sup>2</sup>/h</TableTHelement>
                                    <TableTHelement width="5%">Prosess<br />m<sup>3</sup>/h</TableTHelement>
                                    <TableTHelement width="5%">Luft minimum<br />m<sup>3</sup>/h</TableTHelement>
                                    <TableTHelement width="5%">Vent.prinsipp</TableTHelement>
                                    <TableTHelement width="5%">Gjenvinner</TableTHelement>
                                    <TableTHelement width="5%">Styring</TableTHelement>
                                    <TableTHelement width="30%">Presiseringer</TableTHelement>
                                    <TableTHelement width="5%">dB teknisk</TableTHelement>
                                    <TableTHelement width="5%">dB naborom</TableTHelement>
                                    <TableTHelement width="5%">dB korridor</TableTHelement>
                                    <TableTHelement width="5%">Kommentar</TableTHelement>
                                </TableHeader>
                                <Table>
                                    <tbody>
                                        {
                                            data?.data ? (
                                                data.data.slice()
                                                    .sort((a, b) => {
                                                        if (a.name && b.name) {
                                                            return a.name.localeCompare(b.name);
                                                        }
                                                        return 0;
                                                    })
                                                    .map((rowData, index) =>
                                                        <tr className="hover:bg-table-hover hover:dark:bg-dark-table-hover" key={index}>
                                                            <TableTDelement width="15%">{rowData ? rowData.name : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.air_per_person : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.air_emission : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.air_process : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.air_minimum : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.ventilation_principle : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.heat_exchange : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.room_control : ''}</TableTDelement>
                                                            <TableTDelement width="30%">{rowData ? rowData.notes : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.db_technical : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.db_neighbour : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.db_corridor : ''}</TableTDelement>
                                                            <TableTDelement width="5%">{rowData ? rowData.comments : ''}</TableTDelement>
                                                        </tr>
                                                    )
                                            ) : (
                                                <>
                                                    {data && data.error}
                                                </>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </TableContainer>
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Specification;