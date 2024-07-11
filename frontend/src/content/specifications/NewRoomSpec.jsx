import { useParams } from 'react-router-dom';
import HeaderIcon from '../../assets/svg/specificationsIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent';

function NewRoomSpec() {
    const {suid} = useParams();
    return (
        <>
            <SubTitleComponent>
                <HeaderIcon /> Nytt rom til kravspesifikasjon
            </SubTitleComponent>
            <div className='main-content'>
                <div className="flex-container-row">
                    <div className="cards">
                        <div className="information [ card ]">
                            <h2 className="card-title">Fyll inn romdata - {suid}</h2>
                            <p className="info">
                                <form id="new_room">
                                    <p className="info">
                                        Romtype <br />
                                        <input type="text" className="form-input" name="room_type" placeholder="Romtype, eks: Kontor" tabIndex="1" required />
                                    </p>
                                    <p className="info">
                                        Luftmengde per person m<sup>3</sup>/pers <br />
                                        <input type="text" className="form-input" name="air_per_person"placeholder="m3/pers" tabIndex="2" />
                                    </p>
                                    <p className="info">
                                        Emisjonsbelastning m<sup>3</sup>/h <br />
                                        <input type="text" className="form-input" name="air_emission" placeholder="m3/h" tabIndex="3" required />
                                    </p>
                                    <p className="info">
                                        Prosess m<sup>3</sup>/h <br />
                                        <input type="text" className="form-input" name="air_process"  placeholder="m3/h" tabIndex="4" />
                                    </p>
                                    <p className="info">
                                        Minimum luftmengde m<sup>3</sup>/m<sup>2</sup> <br />
                                        <input type="text" className="form-input" name="air_minimum" placeholder="m3/m2" tabIndex="5" required />
                                    </p>
                                    <p className="info">
                                        Ventilasjonsprinsipp <br />
                                        <select tabIndex="6" id="ventilation_principle" name="ventilation_principle">
                                            <option value="Omrøring">Omrøring</option>
                                            <option value="Fortrengning">Fortrengning</option>
                                            <option value="Annet">Annet</option>
                                        </select>
                                    </p>
                                    <p className="info">
                                        Gjenvinner: <br />
                                        <select id="heat_ex" name="heat_ex" tabIndex="7">
                                            <option value="R">Roterenede</option>
                                            <option value="P">Kryss/plate</option>
                                            <option value="B">Batteri</option>
                                        </select>
                                    </p>
                                    <p className="info">
                                        db-teknisk, db-naborom, db-korridor <br />
                                        <input type="text" className="form-input" name="db_technical" placeholder="32dB" tabIndex="9" /> <br />
                                        <input type="text" className="form-input" name="db_neighbour" placeholder="44dB" tabIndex="10" /> <br />
                                        <input type="text" className="form-input" name="db_corridor" placeholder="28dB" tabIndex="11" />
                                    </p>
                                        <p className="info">
                                            Romstyring: <br />
                                            <div className="checkbox-group">
                                                <label for="vav">VAV:</label>
                                                <input type="radio" name="vav" value="1" tabIndex="12" checked />
                                            </div>
                                            <div className="checkbox-group">
                                                <label for="cav">CAV</label>
                                                <input type="radio" name="vav" value="2" />
                                            </div>
                                            <div className="checkbox-group">
                                                <label for="temp">CO2</label>
                                                <input type="checkbox" name="co2"  tabIndex="13" />
                                            </div>
                                            <div className="checkbox-group">
                                                <label for="temp">Temp</label>
                                                <input type="checkbox" name="temp" tabIndex="14" />
                                            </div>
                                            <div className="checkbox-group">
                                                <label for="movement">Bevegelse</label>
                                                <input type="checkbox" name="movement" tabIndex="15" />
                                            </div>
                                            <div className="checkbox-group">
                                                <label for="moisture">Fukt</label>
                                                <input type="checkbox" name="moisture" tabIndex="16" />
                                            </div>
                                            <div className="checkbox-group">
                                                <label for="time">Tid</label>
                                                <input type="checkbox" name="time" tabIndex="17" />
                                            </div>
                                        </p>
                                        <p className="info">
                                            Presiseringer: <br />
                                            <textarea className="form-text-area" name="notes" tabIndex="18"></textarea>
                                        </p>
                                        <p className="info">
                                            <button type="button" className="spec-button" onclick="submitNewRoom()" tabIndex="19">Legg til</button>
                                        </p>
                                </form>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default NewRoomSpec;