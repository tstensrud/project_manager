import { GlobalContext } from '../../GlobalContext';
import { useParams, Link } from 'react-router-dom';
import { useState, useContext } from 'react';

import useSubmitFile from '../../hooks/useSubmitFile'
import useFetch from '../../hooks/useFetch'
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.svg?react';
import EditIcon from '../../assets/svg/editIcon.svg?react';
import LoadingSpinner from '../../layout/LoadingSpinner';


function Specification() {

    const { projectId } = useParams();
    const { suid } = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

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
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Ny kravspesifikasjon"} projectName={data && data.spec_name} projectNumber={""} />

            <div className="main-content">
                {
                    loading && loading === true ? (
                        <>
                            <LoadingSpinner />
                        </>
                    ) : (
                        <>
                            <div className="text-container-above-tables-spec">
                                <div className='container-flex-column-spec'>
                                    <form onSubmit={handleFileSubmit}>
                                        Last opp csv-fil med rom data. <Link to={`/specifications/${suid}/new_room`}>Eller legg inn enkeltrom her.</Link><br />
                                        <input type="file" accept='.csv' onChange={handleFileChange} disabled={true} /> &nbsp; &nbsp; <button type="submit" class="form-button" disabled>Last opp</button>
                                    </form>
                                </div>
                                <div style={{ display: "flex", flex: "1", justifyContent: "end", alignItems: "center", marginRight: "20px", cursor: "pointer" }}>
                                    <Link to={`/specifications/edit/${suid}`}>Rediger kravspesifikasjon</Link>  &nbsp; <EditIcon />
                                </div>
                            </div>
                            <div className="table-wrapper">
                                <table className="fl-table">
                                    <thead>
                                        <th>Romtype</th>
                                        <th>Luft per person<br />m<sup>3</sup>/h/pers</th>
                                        <th>Emisjon<br />m<sup>3</sup>/m<sup>2</sup>/h</th>
                                        <th>Prosess<br />m<sup>3</sup>/h</th>
                                        <th>Luft minimum<br />m<sup>3</sup>/h</th>
                                        <th>Vent.prinsipp</th>
                                        <th>Gjenvinner</th>
                                        <th>Styring</th>
                                        <th>Presiseringer</th>
                                        <th>dB teknisk</th>
                                        <th>dB naborom</th>
                                        <th>dB korridor</th>
                                        <th>Kommentar</th>
                                    </thead>
                                    <tbody>
                                        {
                                            data && data.data ? (
                                                data.data.map((rowData, index) =>
                                                    <>
                                                        <tr key={index}>
                                                            <td style={{ textAlign: "left", paddingLeft: "15px" }}>{rowData ? rowData.name : ''}</td>
                                                            <td>{rowData ? rowData.air_per_person : ''}</td>
                                                            <td>{rowData ? rowData.air_emission : ''}</td>
                                                            <td>{rowData ? rowData.air_process : ''}</td>
                                                            <td>{rowData ? rowData.air_minimum : ''}</td>
                                                            <td>{rowData ? rowData.ventilation_principle : ''}</td>
                                                            <td>{rowData ? rowData.heat_exchange : ''}</td>
                                                            <td>{rowData ? rowData.room_control : ''}</td>
                                                            <td style={{ textAlign: "left", paddingLeft: "15px", wordWrap: "break-word", wordBreak: "break-all", whiteSpace: "normal" }}>{rowData ? rowData.notes : ''}</td>
                                                            <td>{rowData ? rowData.db_technical : ''}</td>
                                                            <td>{rowData ? rowData.db_neighbour : ''}</td>
                                                            <td>{rowData ? rowData.db_corridor : ''}</td>
                                                            <td>{rowData ? rowData.comments : ''}</td>
                                                        </tr>
                                                    </>)
                                            ) : (
                                                <>
                                                    <span>{data && data.error}</span>
                                                </>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )
                }
            </div>

        </>
    );
}

export default Specification;