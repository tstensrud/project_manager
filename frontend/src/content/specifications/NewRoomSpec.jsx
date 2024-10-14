import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// hooks ++
import useSubmitData from '../../hooks/useSubmitData'
import useFetch from '../../hooks/useFetch'

// components
import HeaderIcon from '../../assets/svg/specificationsIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import MessageBox from '../../layout/MessageBox';
import HelpIcon from '../../assets/svg/helpIcon.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';
import CardSelect from '../../layout/formelements/CardSelect.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';
import CheckBox from '../../layout/formelements/CheckBox.jsx';

// help
import HelpBox from '../../layout/HelpBox.jsx'
import { title, sections } from '../help/SpecNewRoomHelp.jsx'

function NewRoomSpec() {
    const { suid } = useParams();

    // Hooks
    const { data, error: specError } = useFetch(`/specifications/get_spec_room_data/${suid}/`);
    const { data: newData, setData, response, error, handleSubmit } = useSubmitData(`/specifications/new_room/${suid}/`);

    // useStates
    const [submitted, setSubmitted] = useState(false);
    const [showHelpBox, setShowHelpBox] = useState(false);
    const [serverSuccesFalseMsg, setServerSuccesFalseMsg] = useState(null);

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

    useEffect(() => {
        if (response?.success === true) {
            setData('');
            setSubmitted(!submitted);
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
        } else if (response?.success === false) {
            setServerSuccesFalseMsg(response.message);
        }
    }, [response]);

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
        await handleSubmit();
    }

    const toggleHelpBox = (e) => {
        e.preventDefault();
        setShowHelpBox(!showHelpBox);
    }
    
    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText="Nytt rom til kravspesifikasjon" projectName={data && data.spec_name} />
            <MainContentContainer>
                {serverSuccesFalseMsg && <><MessageBox setServerSuccesFalseMsg={setServerSuccesFalseMsg} closeable={true} message={serverSuccesFalseMsg} /> </>}
                {error && <MessageBox message={error} closeable={true} />}
                {specError && <MessageBox message={specError} closeable={true} />}

                {
                    showHelpBox === true && (
                        <HelpBox title={title} sections={sections} setShowHelpBox={toggleHelpBox} />
                    )
                }

                <form onSubmit={submitNewData}>
                    <div className="flex justify-center flex-row w-full">
                        <ContentCard width="36">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row w-full">
                                    <div className="w-[100px]">
                                        <div onClick={toggleHelpBox} className="group cursor-pointer group w-fit p-1 border hover:dark:bg-dark-navbar-hover-bg-color hover:bg-tertiary-color dark:border-dark-grey-text hover:dark:border-dark-primary-color rounded-lg transition duration-200">
                                            <Link onClick={toggleHelpBox} to="#"><HelpIcon /></Link>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 justify-center">
                                        Fyll inn romdata - <Link to={`/specifications/${suid}`} >{data && data.spec_name}</Link>
                                    </div>

                                    <div className="w-[100px]">

                                    </div>
                                </div>

                                <div className="flex flex-row h-fit">
                                    <div className="mr-5">

                                        <div className="mt-5 w-full">
                                            <div>Romtype</div>
                                            <CardInputField ref={roomTypeRef} changeFunction={handleInputChange} name="room_type" placeholder="eks: Kontor" tabIndex={1} required={true} />
                                        </div>

                                        <div className="pt-1">
                                            <CardSelect ref={vavRef} changeFunction={handleInputChange} name="vav" tabIndex={2}>
                                                <option value="1">VAV</option>
                                                <option value="0">CAV</option>
                                            </CardSelect>
                                        </div>

                                        <div className="mt-5 w-full">
                                            <div>Personbelastning</div>
                                            <CardInputField ref={airPerPersonRef} changeFunction={handleInputChange} name="air_per_person" placeholder="m3/pers" tabIndex={3} required={true} />
                                        </div>

                                        <div className="mt-5 w-full">
                                            <div>Emisjon</div>
                                            <CardInputField ref={airEmissionRef} changeFunction={handleInputChange} name="air_emission" placeholder="m3/h" tabIndex={4} required={true} />
                                        </div>

                                        <div className="mt-5 w-full">
                                            <div>Prosess</div>
                                            <CardInputField ref={airProcessRef} changeFunction={handleInputChange} name="air_process" placeholder="m3/h" tabIndex={5} required={false} />
                                        </div>

                                        <div className="mt-5 w-full">
                                            <div>m3/m2 per time</div>
                                            <CardInputField ref={airMinimumRef} changeFunction={handleInputChange} name="air_per_area" placeholder="m3/m2" tabIndex={6} required={false}/>
                                        </div>
                                        <div className="pt-3">
                                            Ventilasjonsprinsipp
                                        </div>
                                        <div>
                                            <CardSelect ref={ventilationPrincipleRef} changeFunction={handleInputChange} name="ventilation_principle" tabIndex={7}>
                                                <option value="Omrøring">Omrøring</option>
                                                <option value="Fortrengning">Fortrengning</option>
                                                <option value="Annet">Annet</option>
                                            </CardSelect>
                                        </div>
                                        <div className="pt-3">
                                            Gjenvinner
                                        </div>
                                        <div>
                                            <CardSelect ref={heatExRef} changeFunction={handleInputChange} name="heat_ex" tabIndex={8}>
                                                <option value="R">Roterenede</option>
                                                <option value="P">Kryss/plate</option>
                                                <option value="B">Batteri</option>
                                            </CardSelect>
                                        </div>

                                    </div>
                                    <div className="ml-10">

                                        <div className="mt-5 w-full">
                                            <div>dB teknisk</div>
                                            <CardInputField ref={dbTechnicalRef} changeFunction={handleInputChange} name="db_technical" placeholder="dB" tabIndex={9} required={false} />
                                        </div>

                                        <div className="mt-5 w-full">
                                            <div>dB til naborom</div>
                                            <CardInputField ref={dbNeighbourRef} changeFunction={handleInputChange} name="db_neighbour" placeholder="dB" tabIndex={10} required={false} />
                                        </div>

                                        <div className="mt-5 w-full">
                                            <div>dB mot korridorsone</div>
                                            <CardInputField ref={dbCorridorRef} changeFunction={handleInputChange} name="db_corridor" placeholder="dB" tabIndex={11} required={false} />
                                        </div>
                                        <div className="pt-3">
                                            Romstyring
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex flex-row">
                                                <div className="w-28">CO2</div>
                                                <div className="flex flex-1 justify-center">
                                                    <CheckBox ref={co2Ref} changeFunction={handleCheckChange} name="co2" tabIndex={12} disabled={newData?.vav === "0" ? true : false} />
                                                </div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="w-28">Temperatur</div>
                                                <div className="flex flex-1  justify-center">
                                                    <CheckBox ref={tempRef} changeFunction={handleCheckChange} name="temp" tabIndex={13} disabled={newData?.vav === "0" ? true : false} />
                                                </div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="w-28">Bevegelese</div>
                                                <div className="flex flex-1  justify-center">
                                                    <CheckBox ref={movementRef} changeFunction={handleCheckChange} name="movement" tabIndex={14} disabled={newData?.vav === "0" ? true : false} />
                                                </div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="w-28">Fukt</div>
                                                <div className="flex flex-1  justify-center">
                                                    <CheckBox ref={moistureRef} changeFunction={handleCheckChange} name="moisture" tabIndex={15} disabled={newData?.vav === "0" ? true : false} />
                                                </div>
                                            </div>

                                            <div className="flex flex-row">
                                                <div className="w-28">Tid</div>
                                                <div className="flex flex-1  justify-center">
                                                    <CheckBox ref={timeRef} changeFunction={handleCheckChange} name="time" tabIndex={17} disabled={newData?.vav === "0" ? true : false} />
                                                </div>
                                            </div>

                                            <div className="mt-5 w-full">
                                                <div>Presiseringer</div>
                                                <CardInputField ref={notesRef} changeFunction={handleInputChange} name="notes" placeholder="Presiseringer" tabIndex={18} required={false} />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <CardButton tabIndex={19} buttonText="Legg til" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ContentCard>
                    </div>
                </form>
            </MainContentContainer>

        </>
    );
}

export default NewRoomSpec;