import { useEffect, useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch'
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import SubTitleComponent from "../../layout/SubTitleComponent";
import HeaderIcon from '../../assets/svg/newSpecIcon.svg?react';

function NewSpec() {
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
                            <p className="info">
                                <input type="text"></input> &nbsp; &nbsp; <button className="form-button">Legg til</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewSpec;