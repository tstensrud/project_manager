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
                        <div className="cards-large">
                            <div className="information [ card ]">
                                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                                    <Link onClick={toggleHelpBox} to="#"><HelpIcon /></Link>
                                </div>
                                <h2 className="card-title">Fyll inn romdata - <Link to={`/specifications/${suid}`} >{data && data.spec_name}</Link></h2>

                                <p className="info">
                                    Romtype <br />
                                    <input ref={roomTypeRef} type="text" onChange={handleInputChange} className="card-input" name="room_type" placeholder="eks: Kontor" tabIndex="1" required /> {response && response.error_room_type ? (<>&nbsp; NB! Romtypen finnes allerede</>) : ''}
                                </p>
                                <p className="info">
                                    Luftmengde per person m<sup>3</sup>/pers <br />
                                    <input ref={airPerPersonRef} type="text" onChange={handleInputChange} className="card-input" name="air_per_person" placeholder="m3/pers" tabIndex="2" /> {response && response.error_air_per_person ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                </p>
                                <p className="info">
                                    Emisjonsbelastning m<sup>3</sup>/h <br />
                                    <input ref={airEmissionRef} type="text" onChange={handleInputChange} className="card-input" name="air_emission" placeholder="m3/h" tabIndex="3" /> {response && response.error_air_emission ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                </p>
                                <p className="info">
                                    Prosess m<sup>3</sup>/h <br />
                                    <input ref={airProcessRef} type="text" onChange={handleInputChange} className="card-input" name="air_process" placeholder="m3/h" tabIndex="4" />{response && response.error_air_process ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                </p>
                                <p className="info">
                                    Minimum luftmengde m<sup>3</sup>/m<sup>2</sup> <br />
                                    <input ref={airMinimumRef} type="text" onChange={handleInputChange} className="card-input" name="air_minimum" placeholder="m3/m2" tabIndex="5" />{response && response.error_air_minimum ? (<>&nbsp; NB! Kun tall i luftmengder</>) : ''}
                                </p>
                                <p className="info">
                                    Ventilasjonsprinsipp <br />
                                    <select className="card-select" ref={ventilationPrincipleRef} tabIndex="6" onChange={handleInputChange} name="ventilation_principle">
                                        <option value="Omrøring">Omrøring</option>
                                        <option value="Fortrengning">Fortrengning</option>
                                        <option value="Annet">Annet</option>
                                    </select>
                                </p>
                                <p className="info">
                                    Gjenvinner: <br />
                                    <select className="card-select" ref={heatExRef} onChange={handleInputChange} name="heat_ex" tabIndex="7">
                                        <option value="R">Roterenede</option>
                                        <option value="P">Kryss/plate</option>
                                        <option value="B">Batteri</option>
                                    </select>
                                </p>
                                <p className="info">
                                    dB-teknisk<br />
                                    <input ref={dbTechnicalRef} type="text" onChange={handleInputChange} className="card-input" name="db_technical" placeholder="dB" tabIndex="8" /> <br />
                                    dB-naborom <br />
                                    <input ref={dbNeighbourRef} type="text" onChange={handleInputChange} className="card-input" name="db_neighbour" placeholder="dB" tabIndex="9" /> <br />
                                    dB-korridor <br />
                                    <input ref={dbCorridorRef} type="text" onChange={handleInputChange} className="card-input" name="db_corridor" placeholder="dB" tabIndex="10" />
                                </p>
                            </div>
                        </div>

                        <div className="cards-large">
                            <div className="information [ card ]">
                                <div style={{width: "500px"}}></div>
                                <p className="info">
                                    Romstyring: <br />
                                </p>
                                <div className="checkbox-group">
                                    <select className="card-select" ref={vavRef} onChange={handleInputChange} name="vav" tabIndex="11">
                                        <option value="1">VAV - variabel luftmengde</option>
                                        <option value="0">CAV - konstant luftmengde</option>
                                    </select>
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

                                <p className="info">
                                    Presiseringer / kommentar til rom: <br />
                                    <input ref={notesRef} onChange={handleInputChange} name="notes" className="card-input" tabIndex="18" />
                                </p>
                                <p className="info">
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