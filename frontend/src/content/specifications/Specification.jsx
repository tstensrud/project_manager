import { GlobalContext } from '../../GlobalContext';
import { useParams, Link } from 'react-router-dom';
import { useState, useContext } from 'react';

// Hooks
import useSubmitFile from '../../hooks/useSubmitFile'
import useFetch from '../../hooks/useFetch'

// SVG
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import EditIcon from '../../assets/svg/editIcon.jsx';
import LoadingSpinner from '../../layout/LoadingSpinner';
import TableTop from '../../layout/TableTop';
import Helpbox from './HelpBox';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from "../../layout/tableelements/TableTDelement.jsx";
import TableWrapper from '../../layout/tableelements/TableWrapper.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';


function Specification() {

    const { projectId } = useParams();
    const { suid } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

    // Hooks
    const { data, loading, error, refetch } = useFetch(`/specifications/get_spec_room_data/${suid}/`);
    const { file, response, error: fileError, setFile, handleSubmit } = useSubmitFile(`/specifications/new_rooms/${suid}/`);

    const specName = data && data.spec_name;

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
                    loading && loading === true ? (
                        <LoadingSpinner />
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
                            <TableTop info={<Helpbox />} />
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
                                <tbody>
                                    {
                                        data && data.data ? (
                                            data.data.map((rowData, index) =>
                                                <tr className="hover:bg-table-hover hover:dark:bg-dark-table-hover" key={index}>
                                                    <TableTDelement>{rowData ? rowData.name : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.air_per_person : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.air_emission : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.air_process : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.air_minimum : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.ventilation_principle : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.heat_exchange : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.room_control : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.notes : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.db_technical : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.db_neighbour : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.db_corridor : ''}</TableTDelement>
                                                    <TableTDelement>{rowData ? rowData.comments : ''}</TableTDelement>
                                                </tr>
                                            )
                                        ) : (
                                            <>
                                                {data && data.error}
                                            </>
                                        )
                                    }
                                </tbody>
                            </TableHeader>
                        </>
                    )
                }
            </MainContentContainer>
        </>
    );
}

export default Specification;