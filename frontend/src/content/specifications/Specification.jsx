import { GlobalContext } from '../../GlobalContext';
import { useParams, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import useSubmitFile from '../../hooks/useSubmitFile'
import useFetch from '../../hooks/useFetch'
import TableHeaderComponent from '../../tables/TableHeaderComponent';
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.svg?react';


function Specification() {

    const {projectId} = useParams();
    const {suid} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

    // Hooks
    const {data, loading, error, refetch} = useFetch(`/specifications/get_spec_room_data/${suid}/`);
    const {file, response, error: fileError, setFile, handleSubmit} = useSubmitFile(`/specifications/new_rooms/${suid}/`);
    const [warning, setWarning] = useState('')

    const columnTitles = [
        {text: "Romtype"},
        {text: <>Luft per person<br/>m<sup>3</sup>/h/pers</>},
        {text: <>Emisjon<br/>m<sup>3</sup>/m<sup>2</sup>/h</>},
        {text: <>Prosess<br/>m<sup>3</sup>/h</>},
        {text: <>Luft minimum<br/>m<sup>3</sup>/h</>},
        {text: "Vent.prinsipp"},
        {text: "Gjenvinner"},
        {text: "Styring"},
        {text: "Presiseringer"},
        {text: "dB teknisk"},
        {text: "dB naborom"},
        {text: "dB korridor"},
        {text: "Kommentar"}
];
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
            <SubTitleComponent>

                    <HeaderIcon />Kravspesifikasjon: {data && data.spec_name}
 
            </SubTitleComponent>
            <div className="main-content">
                <div className="text-container-above-tables-spec">
                    <div className='container-flex-column-spec'>
                        <form onSubmit={handleFileSubmit}>
                                Last opp csv-fil med rom data. <Link to={`/specifications/${suid}/new_room`}>Eller legg inn enkeltrom her.</Link><br />
                                <input type="file" accept='.csv' onChange={handleFileChange} disabled={loading} /> &nbsp; &nbsp; <button type="submit" class="form-button">Last opp</button>
                        </form>
                    </div>
                </div>
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <TableHeaderComponent headers={columnTitles} />
                        </thead>
                        <tbody>
                            {
                                data && data.data ? (
                                    data.data.map((rowData, index) =>
                                        <>
                                            <tr key={index}>
                                                <td style={{textAlign: "left", paddingLeft: "15px"}}>{rowData ? rowData.name : ''}</td>
                                                <td>{rowData ? rowData.air_per_person : ''}</td>
                                                <td>{rowData ? rowData.air_emission : ''}</td>
                                                <td>{rowData ? rowData.air_process : ''}</td>
                                                <td>{rowData ? rowData.air_minimum : ''}</td>
                                                <td>{rowData ? rowData.ventilation_principle : ''}</td>
                                                <td>{rowData ? rowData.heat_exchange : ''}</td>
                                                <td>{rowData ? rowData.room_control : ''}</td>
                                                <td style={{textAlign: "left", paddingLeft: "15px", wordWrap: "break-word", wordBreak: "break-all", whiteSpace: "normal"}}>{rowData ? rowData.notes : ''}</td>
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
            </div>

        </>
    );
}

export default Specification;