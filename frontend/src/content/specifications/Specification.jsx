import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

// Hooks
import useSubmitFile from '../../hooks/useSubmitFile'
import useFetch from '../../hooks/useFetch'

// SVG
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import EditIcon from '../../assets/svg/editIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner';
import TableTop from '../../layout/TableTop';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';
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

    const [warning, setWarning] = useState('')

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

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Kravspesifikasjon"} projectName={data && data.spec_name} projectNumber={""} />

            <MainContentContainer>
                {
                    loading ? (
                        <LoadingSpinner text="romtyper" />
                    ) : (
                        <>
                            <div className="overflow-y-hidden flex justify-center items-center mr-5 ml-5 h-32-spec">
                                <div className='container-flex-col-spec'>
                                    <form onSubmit={handleFileSubmit}>
                                        Last opp csv-fil med rom data. <Link to={`/specifications/${suid}/new_room`}>Eller legg inn enkeltrom her.</Link><br />
                                        <input type="file" accept='.csv' onChange={handleFileChange} disabled={true} /> &nbsp; &nbsp; <button type="submit" className="form-button" disabled>Last opp</button>
                                    </form>
                                </div>
                                <div style={{ display: "flex", flex: "1", justifyContent: "end", alignItems: "center", marginRight: "20px" }}>
                                    <Link to={`/specifications/edit/${suid}/${data.spec_name}`}>Rediger kravspesifikasjon</Link>  &nbsp; <EditIcon />
                                </div>
                            </div>
                            <TableTop title={title} sections={sections} />
                            <TableContainer>
                                <TableHeader>
                                    <thead>
                                        <tr>
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
                                        </tr>
                                    </thead>
                                </TableHeader>
                                <TableWrapper>
                                    <Table>
                                        <tbody>
                                            {
                                                data?.data ? (
                                                    data.data.slice()
                                                    .sort((a,b) => {
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
                                </TableWrapper>
                            </TableContainer>
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Specification;