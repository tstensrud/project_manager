import { useParams, Link } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useState, useRef, useContext, useEffect } from 'react';

// hooks ++
import useSubmitData from '../../hooks/useSubmitData'
import useFetch from '../../hooks/useFetch'

// components
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import MessageBox from '../../layout/MessageBox';
import HelpIcon from '../../assets/svg/helpIcon.jsx';
import HelpBoxNewRoom from './HelpBoxNewRoom';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';
import CardSelect from '../../layout/formelements/CardSelect.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';
import CheckBox from '../../layout/formelements/CheckBox.jsx';

function NewRoomSpec() {
    const { suid } = useParams();

    // Hooks
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
            <MainContentContainer>
                {response?.success && <><MessageBox message={response.success} /> </>}
                {response?.error && <><MessageBox message={response.error} /> </>}

                {
                    showHelpBox === true && (
                        <div className="fixed h-full w-full justify-center items-center z-[1000] left-0 top-[15%]">
                            <div className="w-full h-full flex flex-col mt-[2%] items-center">
                                <div className="bg-tertiary-color flex flex-col pl-5 pr-5 rounded-lg w-[30%] h-[50%] overflow-y-auto shadow-lg shadow-background-shade border border-default-border-color">
                                    <div className="w-full bg-tertiary-color flex justify-end sticky top-0 pt-3">
                                        <Link to="#" onClick={toggleHelpBox}>Lukk</Link>
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <HelpBoxNewRoom />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <form onSubmit={submitNewData}>
                    <div className="flex justify-center flex-row w-full">

                        <ContentCard>
                            <div className="flex justify-start w-full mb-2">
                                <Link onClick={toggleHelpBox} to="#"><HelpIcon /></Link>
                            </div>
                            <h2>Fyll inn romdata - <Link to={`/specifications/${suid}`} >{data && data.spec_name}</Link></h2>

                            <div className="relative mt-5 w-full">
                                <div>Romtype</div>
                                <CardInputField ref={roomTypeRef} changeFunction={handleInputChange} name="room_type" placeholder="eks: Kontor" tabIndex="1" required={true} />
                            </div>

                            <h4>Luftmengdekrav</h4>
                            <div className="relative mt-1 w-full">
                                <div>Personbelastning</div>
                                <CardInputField ref={airPerPersonRef} changeFunction={handleInputChange} name="air_per_person" placeholder="m3/pers" tabIndex="2" required={true} />
                                <div>
                                    {response && response.error_air_per_person && <>NB! Kun tall i luftmengder</>}
                                </div>
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>Emisjon</div>
                                <CardInputField ref={airEmissionRef} changeFunction={handleInputChange} name="air_emission" placeholder="m3/h" tabIndex="3" required={true} />
                                <div>
                                    {response && response.error_air_emission && <>NB! Kun tall i luftmengder</>}
                                </div>
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>Prosess</div>
                                <CardInputField ref={airProcessRef} changeFunction={handleInputChange} name="air_process" placeholder="m3/h" tabIndex="4" required={false} />
                                <div>
                                    {response && response.error_air_process && <>NB! Kun tall i luftmengder</>}
                                </div>
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>Minimum luftmengde</div>
                                <CardInputField ref={airMinimumRef} changeFunction={handleInputChange} name="air_minimum" placeholder="m3/h" tabIndex="5" required={false} />
                                <div>
                                    {response && response.error_air_minimum && <>NB! Kun tall i luftmengder</>}
                                </div>
                            </div>

                            <h4>Ventilasjonsprinsipp</h4>
                            <div>
                                <CardSelect ref={ventilationPrincipleRef} changeFunction={handleInputChange} name="ventilation_principle" tabIndex="6">
                                    <option value="Omrøring">Omrøring</option>
                                    <option value="Fortrengning">Fortrengning</option>
                                    <option value="Annet">Annet</option>
                                </CardSelect>
                            </div>


                            <h4>Gjenvinner</h4>
                            <div>
                                <CardSelect ref={heatExRef} changeFunction={handleInputChange} name="heat_ex" tabIndex="7">
                                    <option value="R">Roterenede</option>
                                    <option value="P">Kryss/plate</option>
                                    <option value="B">Batteri</option>
                                </CardSelect>
                            </div>
                        </ContentCard>

                        <ContentCard>
                            <h4>Lydkrav</h4>

                            <div className="relative mt-5 w-full">
                                <div>dB teknisk</div>
                                <CardInputField ref={dbTechnicalRef} changeFunction={handleInputChange} name="db_technical" placeholder="dB" tabIndex="8" required={false} />
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>dB til naborom</div>
                                <CardInputField ref={dbNeighbourRef} changeFunction={handleInputChange} name="db_neighbour" placeholder="dB" tabIndex="9" required={false} />
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>dB mot korridorsone</div>
                                <CardInputField ref={dbCorridorRef} changeFunction={handleInputChange} name="db_corridor" placeholder="dB" tabIndex="10" required={false} />
                            </div>

                            <h4>Romstyring</h4>
                            <div className="checkbox-group">
                                <p>
                                    <CardSelect ref={vavRef} changeFunction={handleInputChange} name="vav" tabIndex="11">
                                        <option value="1">VAV</option>
                                        <option value="0">CAV</option>
                                    </CardSelect>
                                </p>
                            </div>
                            <div className="mt-3">
                                <div className="flex flex-row">
                                    <div className="w-1/3">CO2</div>
                                    <div className="flex flex-1">
                                        <CheckBox ref={co2Ref} changeFunction={handleCheckChange} name="co2" tabIndex="12" />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-1/3">Temperatur</div>
                                    <div className="flex flex-1">
                                        <CheckBox ref={tempRef} changeFunction={handleCheckChange} name="temp" tabIndex="13" />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-1/3">Bevegelese</div>
                                    <div className="flex flex-1">
                                        <CheckBox ref={movementRef} changeFunction={handleCheckChange} name="movement" tabIndex="14" />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="w-1/3">Fukt</div>
                                    <div className="flex flex-1">
                                        <CheckBox ref={moistureRef} changeFunction={handleCheckChange} name="moisture" tabIndex="15" />
                                    </div>
                                </div>

                                <div className="flex flex-row">
                                    <div className="w-1/3">Tid</div>
                                    <div className="flex flex-1">
                                        <CheckBox ref={timeRef} changeFunction={handleCheckChange} name="time" tabIndex="16" />
                                    </div>
                                </div>

                                <div className="relative mt-5 w-full">
                                    <div>Presiseringer</div>
                                    <CardInputField ref={notesRef} changeFunction={handleInputChange} name="notes" placeholder="Presiseringer" tabIndex="18" required={false} />
                                </div>
                            </div>
                            <div className="mt-3">
                                <CardButton tabIndex="19" buttonText="Legg til" />
                            </div>
                        </ContentCard>
                    </div>
                </form>
            </MainContentContainer>

        </>
    );
}

export default NewRoomSpec;