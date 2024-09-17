import { useState } from 'react';
import { Link } from 'react-router-dom';

// hooks ++
import useSubmitData from '../../hooks/useSubmitData'

// components
import SubTitleComponent from "../../layout/SubTitleComponent";
import HeaderIcon from '../../assets/svg/newSpecIcon.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';

function NewSpec() {

    const { data: newData, setData, loading, response, error, handleSubmit } = useSubmitData('/specifications/new_specification/');
    const [specName, setSpecName] = useState("");

    const handleInputChange = (e) => {
        setData({
            ...newData,
            [e.target.name]: e.target.value,
        });
        setSpecName(e.target.value);
    }

    const submitNewSpec = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        setData('');
    }

    return (
        <>

            <SubTitleComponent svg={<HeaderIcon />} headerText={"Ny kravspesifikasjon"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full">
                    <ContentCard>
                        <h2>Opprett ny kravspesifikasjon</h2>
                        <p>Skriv inn navnet på kravspesifikasjonen du vil opprette. Gi den et beskrivende navn slik at det er lett å forstå hva det gjelder.
                        </p>
                        <p>
                            Er det en generell kravspesfikasjon som kan benyttes i flere prosjetker, bruk for eksempel et navn som: <br />
                            - SKOK - omsorgsboliger, 2024. <br />
                            Er det en mer prosjektspesifik kravspesifikasjon bruk et navn som: <br />
                            - Brekketunet bolig, Obos, 2024
                        </p>
                        <form onSubmit={submitNewSpec}>
                            <p>
                                <input className="card-input" name="spec_name" onChange={handleInputChange} type="text" placeholder="Navn på kravspesifikasjon" />
                                <button type="submit" className="card-button">Legg til</button>
                            </p>
                        </form>
                        <p>
                            {response?.success === false && (<>{response.message}</>)}
                        </p>
                        <p>
                            {response?.succes === true && (<>{response.response}: <Link to={`/specifications/${response.data}`}>{specName}</Link></>)}
                        </p>
                    </ContentCard>
                </div>
            </MainContentContainer>
        </>
    );
}

export default NewSpec;