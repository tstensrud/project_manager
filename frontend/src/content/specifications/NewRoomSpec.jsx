import { useParams, Link } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useState, useRef, useContext, useEffect } from 'react';

import useSubmitData from '../../hooks/useSubmitData'
import useFetch from '../../hooks/useFetch'
import HeaderIcon from '../../assets/svg/specificationsIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent';
import MessageBox from '../../layout/MessageBox';
import TableTop from '../../layout/TableTop';
import HelpIcon from '../../assets/svg/helpIcon.svg?react';
import HelpBoxNewRoom from './HelpBoxNewRoom';

function NewRoomSpec() {
    const { suid } = useParams();

    // Hooks
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const { data, loading: specLoading, error: specError, refetch } = useFetch(`/specifications/get_spec_room_data/${suid}/`);
    const { data: newData, setData, loading, response, error, handleSubmit } = useSubmitData(`/specifications/new_room/${suid}/`);

    // useStates
    const [submitted, setSubmitted] = useState(false);
    const [showHelpBox, setShowHelpBox] = useState(false);

    // Input fields useRefs
    const roomTypeRef = useRef(null);
    const airPerPersonRef = useRef(null);
    const airEmissionRef = useRef(null);
    const airProcessRef = useRef(null);
    const airMinimumRef = useRef(null);
    const ventilationPrincipleRef = useRef(null);
    const heatExRef = useRef(null);
    const dbTechnicalRef = useRef(null);
    const dbNeighbourRef = useRef(null);
    const dbCorridorRef = useRef(null);
    const vavRef = useRef(null);
    const co2Ref = useRef(null);
    const tempRef = useRef(null);
    const movementRef = useRef(null);
    const moistureRef = useRef(null);
    const timeRef = useRef(null);
    const notesRef = useRef(null);

    useEffect(() => {
        setData({ "vav": "1", "ventilation_principle": "Omrøring", "heat_ex": "R", "co2": false, "temp": false, "movement": false, "moisture": false, "time": false, "notes": '' })
    }, []);

    useEffect(() => {
        setData({ "vav": "1", "ventilation_principle": "Omrøring", "heat_ex": "R", "co2": false, "temp": false, "movement": false, "moisture": false, "time": false, "notes": '' })
    }, [submitted]);

    const handleInputChange = (e) => {
        setData({
            ...newData,
            [e.target.name]: e.target.value,
        })
    }

    const handleCheckChange = (e) => {
        setData({
            ...newData,
            [e.target.name]: e.target.checked,
        })
    }

    const submitNewData = async (e) => {
        e.preventDefault();

        //console.log(newData);
        setData('');
        setSubmitted(!submitted)
        await handleSubmit(e);

        roomTypeRef.current.value = '';
        airPerPersonRef.current.value = '';
        airEmissionRef.current.value = '';
        airProcessRef.current.value = '';
        airMinimumRef.current.value = '';
        ventilationPrincipleRef.current.value = ventilationPrincipleRef.current.options[0].value;
        heatExRef.current.value = heatExRef.current.options[0].value;
        vavRef.current.value = vavRef.current.options[0].value;
        dbTechnicalRef.current.value = '';
        dbNeighbourRef.current.value = '';
        dbCorridorRef.current.value = '';
        co2Ref.current.checked = false;
        tempRef.current.checked = false;
        movementRef.current.checked = false;
        moistureRef.current.checked = false;
        timeRef.current.checked = false;
        notesRef.current.value = '';
    }

    const toggleHelpBox = (e) => {
        e.preventDefault();
        setShowHelpBox(!showHelpBox);
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText="Nytt rom til kravspesifikasjon" projectName={data && data.spec_name} />
            <div className='main-content'>
                {response && response.success ? <><MessageBox message={response.success} /> </> : ''}
                {response && response.error ? <><MessageBox message={response.error} /> </> : ''}

                {
                    showHelpBox === true ? (
                        <div className="help-box-wrapper">
                            <div className="help-box-container">
                                <div className="help-box-card">
                                    <div className="help-box-card-header">
                                        <Link to="#" onClick={toggleHelpBox}>Lukk</Link>
                                    </div>
                                    <div className="help-box-card-item">
                                        <HelpBoxNewRoom />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)
                }

                <form onSubmit={submitNewData}>
                    <div className="flex-container-row">
                        <div className="content-card">
                            <div className="content-card-container">
                                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                                    <Link onClick={toggleHelpBox} to="#"><HelpIcon /></Link>
                                </div>
                                <h2 className="card-title">Fyll inn romdata - <Link to={`/specifications/${suid}`} >{data && data.spec_name}</Link></h2>

                                <div className="input-container">
                                    <input className="input-container-input" ref={roomTypeRef} onChange={handleInputChange} name="room_type" type="text" tabIndex="1" placeholder="eks: Kontor" required/>
                                    <label for="input-field" className="input-label">Romtype</label>
                                </div>

                                <h4>Luftmengdekrav</h4>
                                <div className="input-container">
                                    <input className="input-container-input" ref={airPerPersonRef} onChange={handleInputChange} name="air_per_person" type="text" tabIndex="2" placeholder="m3/pers" />{response && response.error_air_per_person ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                    <label for="input-field" className="input-label">Personbelastning</label>
                                </div>

                                <div className="input-container">
                                    <input className="input-container-input" ref={airEmissionRef} onChange={handleInputChange} name="air_emission" type="text" tabIndex="3" placeholder="m3/h" />{response && response.error_air_emission ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                    <label for="input-field" className="input-label">Emisjon</label>
                                </div>

                                <div className="input-container">
                                    <input className="input-container-input" ref={airProcessRef} onChange={handleInputChange} name="air_process" type="text" tabIndex="4" placeholder="m3/h" />{response && response.error_air_process ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                    <label for="input-field" className="input-label">Prosess</label>
                                </div>

                                <div className="input-container">
                                    <input className="input-container-input" ref={airMinimumRef} onChange={handleInputChange} name="air_minimum" type="text" tabIndex="5" placeholder="m3/h" />{response && response.error_air_minimum ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                    <label for="input-field" className="input-label">Minimum luftmengde</label>
                                </div>

                                <h4>Ventilasjonsprinsipp</h4>
                                <p style={{ marginBottom: "5px" }}>
                                    <select className="card-select" ref={ventilationPrincipleRef} tabIndex="6" onChange={handleInputChange} name="ventilation_principle">
                                        <option value="Omrøring">Omrøring</option>
                                        <option value="Fortrengning">Fortrengning</option>
                                        <option value="Annet">Annet</option>
                                    </select>
                                </p>


                                <h4>Gjenvinner</h4>
                                <p style={{ marginBottom: "0px" }}>
                                    <select className="card-select" ref={heatExRef} onChange={handleInputChange} name="heat_ex" tabIndex="7">
                                        <option value="R">Roterenede</option>
                                        <option value="P">Kryss/plate</option>
                                        <option value="B">Batteri</option>
                                    </select>
                                </p>
                            </div>
                        </div>

                        <div className="content-card">
                            <div className="content-card-container">
                                <div style={{ width: "500px" }}></div>
                                <h4>Lydkrav</h4>
                                
                                <div className="input-container">
                                    <input className="input-container-input" ref={dbTechnicalRef} onChange={handleInputChange} name="db_technical" type="text" tabIndex="8" placeholder="dB" />
                                    <label for="input-field" className="input-label">Minimum luftmengde</label>
                                </div>

                                <div className="input-container">
                                    <input className="input-container-input" ref={dbNeighbourRef} onChange={handleInputChange} name="db_neighbour" type="text" tabIndex="9" placeholder="dB" />
                                    <label for="input-field" className="input-label">Minimum luftmengde</label>
                                </div>

                                <div className="input-container">
                                    <input className="input-container-input" ref={dbCorridorRef} onChange={handleInputChange} name="db_corridor" type="text" tabIndex="10" placeholder="dB" />
                                    <label for="input-field" className="input-label">Minimum luftmengde</label>
                                </div>
                                
                                <h4>Romstyring</h4>
                                <div className="checkbox-group">
                                    <p>
                                        <select className="card-select" ref={vavRef} onChange={handleInputChange} name="vav" tabIndex="11">
                                            <option value="1">VAV - variabel luftmengde</option>
                                            <option value="0">CAV - konstant luftmengde</option>
                                        </select>
                                    </p>
                                </div>
                                <br /><br />
                                <div className="checkbox-group">
                                    <label htmlFor="temp">CO2</label>
                                    <input ref={co2Ref} type="checkbox" onChange={handleCheckChange} name="co2" tabIndex="13" />
                                </div>
                                <div className="checkbox-group">
                                    <label htmlFor="temp">Temp</label>
                                    <input ref={tempRef} type="checkbox" onChange={handleCheckChange} name="temp" tabIndex="14" />
                                </div>
                                <div className="checkbox-group">
                                    <label htmlFor="movement">Bevegelse</label>
                                    <input ref={movementRef} type="checkbox" onChange={handleCheckChange} name="movement" tabIndex="15" />
                                </div>
                                <div className="checkbox-group">
                                    <label htmlFor="moisture">Fukt</label>
                                    <input ref={moistureRef} type="checkbox" onChange={handleCheckChange} name="moisture" tabIndex="16" />
                                </div>
                                <div className="checkbox-group">
                                    <label htmlFor="time">Tid</label>
                                    <input ref={timeRef} type="checkbox" onChange={handleCheckChange} name="time" tabIndex="17" />
                                </div>

                                <div className="input-container">
                                    <input className="input-container-input" ref={notesRef} onChange={handleInputChange} name="notes" type="text" tabIndex="18" placeholder="Presiseringer " />
                                    <label for="input-field" className="input-label">Minimum luftmengde</label>
                                </div>

                                <p>
                                    <button type="submit" className="card-button" tabIndex="19">Legg til</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </>
    );
}

export default NewRoomSpec;