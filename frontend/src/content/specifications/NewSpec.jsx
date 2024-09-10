import { useState } from 'react';
import useSubmitData from '../../hooks/useSubmitData'
import { Link } from 'react-router-dom';
import SubTitleComponent from "../../layout/SubTitleComponent";
import HeaderIcon from '../../assets/svg/newSpecIcon.svg?react';

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
            <div className="main-content">
                <div className="flex-container-row">
                    <div className="content-card">
                        <div className="content-card-container">
                            <h2 className="card-title">Opprett ny kravspesifikasjon</h2>
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
                                {response && response.error ? (<>{response.error}</>) : (<></>)}
                            </p>
                            <p>
                                {response && response.response !== null ? (<>{response.response}: <Link to={`/specifications/${response.data}`}>{specName}</Link></>) : (<></>)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewSpec;