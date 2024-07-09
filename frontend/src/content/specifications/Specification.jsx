import { GlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
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
    const {file, response, setData, handleSubmit} = useSubmitFile(`/specifications/new_rooms/${suid}/`);
    
    const [selectedFile, setSelectedFile] = useState();
    const [warning, setWarning] = useState('')

    const columnTitles = [
        {text: "Romtype"},
        {text: "Luft per person"},
        {text: "Emisjon"},
        {text: "Prosess"},
        {text: "Luft minimum"},
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
        setSelectedFile(selectedFile);
        console.log(file);
    }

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            console.log("Handle file submit")
            setWarning('Ingen fil valgt.')
            return;
        } else {
            console.log("Handle file submit")
            const formData = new FormData();
            formData.append('file', selectedFile);
            setData(formData)
            await handleFileSubmit(e)
        }
    }

    return (
    <>
        <SubTitleComponent>
         <HeaderIcon/>   Kravspesifikasjon: {data && data.spec_name}
        </SubTitleComponent>
            <div className="main-content">
            <div className="text-container-above-tables">
            <div className='container-flex-column'>
            <form onSubmit={handleFileSubmit}>
            <p>
                Last opp csv-fil med rom data. {warning} <br />
                <input type="file" accept='.csv' onChange={handleFileChange} /> &nbsp; &nbsp; <button type="submit" class="form-button">Last opp</button>
            </p>
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
                                                <td>{rowData ? rowData.name : ''}</td>
                                                <td>{rowData ? rowData.air_per_person : ''}</td>
                                                <td>{rowData ? rowData.air_emission : ''}</td>
                                                <td>{rowData ? rowData.air_process : ''}</td>
                                                <td>{rowData ? rowData.air_minimum : ''}</td>
                                                <td>{rowData ? rowData.ventilation_principle : ''}</td>
                                                <td>{rowData ? rowData.heat_exchange : ''}</td>
                                                <td>{rowData ? rowData.control : ''}</td>
                                                <td>{rowData ? rowData.notes : ''}</td>
                                                <td>{rowData ? rowData.db_technical : ''}</td>
                                                <td>{rowData ? rowData.db_neighbour : ''}</td>
                                                <td>{rowData ? rowData.db__corridor : ''}</td>
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