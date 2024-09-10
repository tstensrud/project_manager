import { GlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';

import useFetch from '../../hooks/useFetch'
import useSubmitData from '../../hooks/useSubmitData'

import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/ventSystemIcon.svg?react';
import MessageBox from '../../layout/MessageBox';
import LoadingSpinner from '../../layout/LoadingSpinner';


function NewSystem() {
    const { projectId } = useParams();

    // Hooks
    const { data: systemData, response: systemResponse, setData: setSystemData, handleSubmit: submitSystemData } = useSubmitData(`/project_api/${projectId}/new_system/`);

    // useEffects
    useEffect(() => {
        if (systemResponse?.success && systemResponse.success === true) {
            systemNumberRef.current.value = '';
            placementRef.current.value = '';
            serviceAreaRef.current.value = '';
            fanCapacityRef.current.value = '';
            heatExRef.current.value = heatExRef.current.options[0].value;
            specialSystemRef.current.checked = false;
        }
    }, [systemResponse]);

    // Handlers
    const handleFormChange = (e) => {
        setSystemData({
            ...systemData,
            [e.target.name]: e.target.value,
        })
    }

    const handleCheckBoxChange = (e) => {
        setSystemData({
            ...systemData,
            [e.target.name]: e.target.checked,
        })
    }

    const handleSubmitNewSystem = async (e) => {
        e.preventDefault();
        await submitSystemData(e);
    }

    // Form-element refs
    const systemNumberRef = useRef(null);
    const placementRef = useRef(null);
    const serviceAreaRef = useRef(null);
    const fanCapacityRef = useRef(null);
    const heatExRef = useRef(null);
    const specialSystemRef = useRef(null);
    
    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Legg til nytt ventilasjonssystem"} projectName={""} projectNumber={""} />
            <div className="main-content">
                {systemResponse?.error && systemResponse.error !== null && (<MessageBox message={systemResponse.error} />)}
                {systemResponse?.success && systemResponse.success === true && (<MessageBox message={systemResponse.message} />)}
                <div className="flex-container-row">
                    <div className="content-card">
                        <div className="content-card-container">
                            <h3>Legg til nytt ventilasjonssystem</h3>
                            <form id="system" onSubmit={handleSubmitNewSystem} role="form">
                                <div className="input-container">
                                    <input ref={systemNumberRef} className="input-container-input" onChange={handleFormChange} name="systemNumber" type="text" tabIndex="1" placeholder="360.001" required />
                                    <label for="input-field" className="input-label-left">Systemnummer</label>
                                </div>

                                <div className="input-container">
                                    <input ref={placementRef} className="input-container-input" onChange={handleFormChange} name="placement" type="text" tabIndex="2" required />
                                    <label for="input-field" className="input-label-left">Aggregatplassering</label>
                                </div>

                                <div className="input-container">
                                    <input ref={serviceAreaRef} className="input-container-input" onChange={handleFormChange} name="serviceArea" type="text" tabIndex="3" required />
                                    <label for="input-field" className="input-label-left">Betjeningsområde</label>
                                </div>

                                <div className="input-container">
                                    <input ref={fanCapacityRef} className="input-container-input" onChange={handleFormChange} name="airflow" type="text" tabIndex="4" required />
                                    <label for="input-field" className="input-label-left">Viftekapasitet m<sup>3</sup>/h <br /></label>
                                </div>
                                <p>
                                    <select ref={heatExRef} className="card-select" onChange={handleFormChange} name="heat_exchange" tabIndex="5">
                                        <option value="none">- Gjenvinner -</option>
                                        <option value="R">Roterende</option>
                                        <option value="P">Plate/kryss</option>
                                        <option value="B">Batteri</option>
                                        <option value="0">Ingen</option>
                                    </select>
                                </p>
                                <p style={{ display: "flex", textAlign: "center", alignItems: "center" }}>
                                    Spesialsystem&nbsp;
                                    <input ref={specialSystemRef} type="checkbox" onChange={handleCheckBoxChange} name="special_system" tabIndex="6" />
                                </p>

                                <p>
                                    <button className="card-button" tabIndex="7">Legg til</button>
                                </p>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewSystem;