import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// hooks ++
import useSubmitData from '../../hooks/useSubmitData'

// components
import SubTitleComponent from "../../layout/SubTitleComponent";
import HeaderIcon from '../../assets/svg/newSpecIcon.jsx';
import MessageBox from '../../layout/MessageBox';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import ContentCard from '../../layout/ContentCard.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';
import Table from '../../layout/tableelements/Table.jsx';
import TableHeader from '../../layout/tableelements/TableHeader.jsx';
import TableTHelement from '../../layout/tableelements/TableTHelement.jsx';
import TableTDelement from '../../layout/tableelements/TableTDelement.jsx';
import TableContainer from '../../layout/tableelements/TableContainer.jsx';
import EditableInputField from '../../layout/tableelements/EditableInputField.jsx';

function NewSpec() {

    const { data: newData, setData, loading, response, error, handleSubmit } = useSubmitData('/specifications/new_specification/');
    const [specName, setSpecName] = useState("");

    useEffect(() => {
        if (newData?.success) {
            setData('');
        }
    }, [response])
    const handleInputChange = (e) => {
        setData({
            ...newData,
            [e.target.name]: e.target.value,
        });
        setSpecName(e.target.value);
    }

    const submitNewSpec = async (e) => {
        e.preventDefault();
        await handleSubmit();
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Ny kravspesifikasjon"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                {error && <MessageBox message={error} closeable={true} />}
                <div className="flex justify-center flex-row w-full">
                    <ContentCard width="44">
                        <div>
                            <h2>Opprett ny kravspesifikasjon</h2>
                        </div>
                        <div className="mt-3">
                            Skriv inn navnet på kravspesifikasjonen du vil opprette. Gi den et beskrivende navn slik at det er lett å forstå hva det gjelder.
                        </div>
                        <div className="mt-3">
                            Er det en generell kravspesfikasjon som kan benyttes i flere prosjetker, bruk for eksempel et navn som: <br />
                            - SKOK - omsorgsboliger, 2024. <br />
                            Er det en mer prosjektspesifik kravspesifikasjon bruk et navn som: <br />
                            - Brekketunet bolig, Obos, 2024
                        </div>
                        <form>
                            <div className="mt-3">
                                <CardInputField name="spec_name" changeFunction={handleInputChange} placeholder="Navn på kravspesifikasjon" />
                            </div>
                            <div className="mt-3">
                                <CardButton loading={loading} clickFunction={submitNewSpec} buttonText="Legg til" />
                            </div>
                        </form>
                        <div>
                            {response?.success === false && (<>{response.message}</>)}
                        </div>
                        <div>
                            {response?.success === true && (<>{response.message}: <Link to={`/specifications/${response.data}`}>{specName}</Link></>)}
                        </div>
                    </ContentCard>
                </div>
            </MainContentContainer>
        </>
    );
}

export default NewSpec;