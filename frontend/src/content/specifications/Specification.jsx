import { GlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import TableHeaderComponent from '../../tables/TableHeaderComponent';
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/specificationsIcon.svg?react';


function Specification() {

    const {projectId} = useParams();
    const {suid} = useParams();
    const {data, loading, error, refetch} = useFetch(`/specifications/get_spec_room_data/${suid}/`);
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);  
    
    useEffect(() => {
        setActiveProject(projectId);

    },[]);

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

    return (
    <>
        <SubTitleComponent>
         <HeaderIcon/>   Kravspesifikasjon: {data && data.spec_name}
        </SubTitleComponent>
            <div className="main-content">
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
                                        <span>Ingen rom lagt inn</span>
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