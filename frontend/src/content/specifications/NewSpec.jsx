import { useEffect, useState, useContext } from 'react';
import useSubmitData from '../../hooks/useSubmitData'
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import SubTitleComponent from "../../layout/SubTitleComponent";
import HeaderIcon from '../../assets/svg/newSpecIcon.svg?react';

function NewSpec() {

    const {data: newData, setData, loading, response, error, handleSubmit} = useSubmitData('/specifications/new_specification/');
    
    
    const handleInputChange = (e) => {
        setData ({
            ...newData,
            [e.target.name]: e.target.value,
        });
    }

    const submitNewSpec = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        setData('');
    }

    return (
        <>
        
            <SubTitleComponent>
               <HeaderIcon /> Ny kravspesifikasjon
            </SubTitleComponent>
            <div className="main-content">
            <div className="flex-container-row">
                    <div className="cards">
                        <div className="information [ card ]">
                            <h2 className="card-title">Opprett ny kravspesifikasjon</h2>
                            <p className="info">Skriv inn navnet på kravspesifikasjonen du vil opprette. Gi den et beskrivende navn slik at det er lett å forstå hva det gjelder.<br />
                            Er det en generell kravspesfikasjon bruk for eksempel et navn som: <br/>
                            SKOK - omsorgsboliger. <br/>
                            Er det en mer prosjektspesifik kravspesifikasjon bruk et navn som: <br/>
                            - Brekketunet bolig, Obos, 2024
                            </p>
                            <form onSubmit={submitNewSpec}>
                            <p className="info">
                                <input name="spec_name" onChange={handleInputChange} type="text" placeholder="Navn på kravspesifikasjon"></input> &nbsp; &nbsp; <button type="submit" className="form-button">Legg til</button>
                            </p>
                            </form>
                            <p>
                                {response && response.error ? (<>{response.error}</>) : (<></>)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewSpec;