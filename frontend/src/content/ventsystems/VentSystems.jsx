import { GlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'

import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/ventSystemIcon.svg?react';
import TableHeaderComponent from "../../tables/TableHeaderComponent";
import SystemsTableRowComponent from "../../tables/SystemsTableRowComponent";

function VentSystems () {
    const {projectId} = useParams();
    const {setActiveProject} = useContext(GlobalContext);
    const {data: systemData, response: systemResponse, setData: setSystemData, handleSubmit: submitSystemData} = useSubmitData(`/project_api/${projectId}/new_system/`);


    useEffect(() => {
        setActiveProject(projectId);
    },[]);

    const handleFormChange = (e) => {
        setSystemData({
            ...systemData,
            [e.target.name]: e.target.value,
        })
    }

    const columnTitles = [
        {text: "Systemnr"},
        {text: "Plassering"},
        {text: "Betjeningsområde"},
        {text: "Viftekapasitet m3/h"},
        {text: "Gjenvinner"},
        {text: "Prosjektert tilluft"},
        {text: "Prosjektert avtrekk"},
        {text: "Spesialsystem"},
        {text: "Kommentar"}
    ]
    return (
<>
    <SubTitleComponent>
        <HeaderIcon /> Ventilasjonssytemer
    </SubTitleComponent>
    <div className="main-content">
            <div className="split-container-left">
                <form id="system" method="POST" role="form">
                    Systemnummer <br />
                    <input type="text" name="systemNumber" className='input-medium' placeholder="Systemnummer" tabindex="1" required />
                    <br />
                    <br />
                    Aggregatplassering <br />
                    <input type="text" name="placement" className='input-medium' placeholder="Plassering" tabindex="2" required />
                    <br />
                    <br />
                    Betjeningsområde <br />
                    <input type="text" name="serviceArea" className='input-medium'placeholder="Betjeningsområde" tabindex="3" />
                    <br />
                    <br />
                    Viftekapasitet m<sup>3</sup>/h <br />
                    <input type="text" name="airflow" className='input-medium' placeholder="Luftmengde" tabindex="4" />
                    <br />
                    <br />
                    <select id="heat_exchange" name="heat_exchange" tabindex="5">
                        <option value="none">- Gjenvinner -</option>
                        <option value="R">Roterende</option>
                        <option value="P">Plate/kryss</option>
                        <option value="B">Batteri</option>
                        <option value="0">Ingen</option>
                    </select>
                    <br />
                    <br />
                    Spesialsystem 
                    <input type="checkbox" name="special_system" tabindex="6" />
                    <br />
                    <button type="submit" className="form-button" tabindex="7">Legg til</button>
                </form>
            </div>
            <div className="split-container-right">
                <div className="table-wrapper">
                    <table className="fl-table">
                        <thead>
                            <TableHeaderComponent headers={columnTitles} />
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
    </div>
</>
    );
}

export default VentSystems;