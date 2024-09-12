import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// hooks ++
import useSubmitData from '../../hooks/useSubmitData'

// components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/ventSystemIcon.jsx';
import MessageBox from '../../layout/MessageBox';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';
import CardButton from '../../layout/formelements/CardButton';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardSelect from '../../layout/formelements/CardSelect.jsx';
import CheckBox from '../../layout/formelements/CheckBox.jsx';


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
            <MainContentContainer>
                {systemResponse?.error && systemResponse.error !== null && (<MessageBox message={systemResponse.error} />)}
                {systemResponse?.success && systemResponse.success === true && (<MessageBox message={systemResponse.message} />)}
                <div className="flex justify-center flex-row w-full">
                    <ContentCard>
                        <h3>Legg til nytt ventilasjonssystem</h3>
                        <form id="system" onSubmit={handleSubmitNewSystem} role="form">
                            <div className="relative mt-5 w-full">
                                <div>Systemnummer</div>
                                <CardInputField ref={systemNumberRef} changeFunction={handleFormChange} name="systemNumber" type="text" tabIndex="1" placeholder="360.001" required />
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>Aggregatplassering</div>
                                <CardInputField ref={placementRef} changeFunction={handleFormChange} name="placement" type="text" tabIndex="2" required />
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>Betjeningsområde</div>
                                <CardInputField ref={serviceAreaRef} changeFunction={handleFormChange} name="serviceArea" type="text" tabIndex="3" required />
                            </div>

                            <div className="relative mt-5 w-full">
                                <div>Viftekapasitet m<sup>3</sup>/h <br /></div>
                                <CardInputField ref={fanCapacityRef} changeFunction={handleFormChange} name="airflow" type="text" tabIndex="4" required />
                            </div>
                            <div className="mt-5">
                                <CardSelect ref={heatExRef} changeFunction={handleFormChange} name="heat_exchange" tabIndex="5">
                                    <option value="none">- Gjenvinner -</option>
                                    <option value="R">Roterende</option>
                                    <option value="P">Plate/kryss</option>
                                    <option value="B">Batteri</option>
                                    <option value="0">Ingen</option>
                                </CardSelect>
                            </div>
                            <div className="flex mt-5">
                                <div className="w-32">
                                    Spesialsystem
                                </div>
                                <div>
                                    <CheckBox ref={specialSystemRef} onChange={handleCheckBoxChange} name="special_system" tabIndex="6" />
                                </div>
                            </div>

                            <div className="mt-5">
                                <CardButton buttonText="Legg til" tabIndex="7" />
                            </div>

                        </form>
                    </ContentCard>
                </div>
            </MainContentContainer >
        </>
    );
}

export default NewSystem;