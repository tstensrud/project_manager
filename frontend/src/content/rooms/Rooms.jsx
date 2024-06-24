import { useState, useEffect } from 'react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import Table from '../../tables/Table';
import SelectComponent from '../../formcomponents/SelectComponent';

function Rooms () {
    const[roomTypes, setRoomTypes] = useState([]);    
    useEffect (() => {
        fetchRoomTypes();
    }, []);

    const columnTitles = [  {text: "Bygg"},
                            {text: "Etasje"},
                            {text: "Romnr"},
                            {text: "Romtype"},
                            {text: "Romnavn"},
                            {text: "Areal m2"},
                            {text: "Personer"},
                            {text: "Kommentarer"},
    ];

    const fetchRoomTypes = async () => {
        const response = await fetch("http://127.0.0.1:5000/specifications/get_spec_room_types");
        const data = await response.json();
        setRoomTypes(data);
    };
    console.log(roomTypes);
    
    return (
        <>
            <div className="no-print">
                <form id="new_room" method="POST" role="form">
                <p>Legg til nytt rom</p>
                    <p>
                        <input type="text" name="project_id" id="project_id" value="{{project.id}}" hidden readOnly />

                        <SelectComponent title="- Romtyper -" id="room_type" values={roomTypes} />
                        
                        <select name="building_id" id="building_id">
                            <option value="none">- Bygg -</option>
                            <option value="{{building.id}}"></option>
                        </select>
                        <input type="text" name="room_floor" id="room_floor" placeholder="Etasje" tabIndex="1" required />
                        <input type="text" name="room_number" id="room_number" placeholder="Romnummer" tabIndex="2" required />
                        <input type="text" name="room_name" id="room_name" placeholder="Romnavn" tabIndex="3" required />
                        <input type="text" name="room_area" id="room_area" placeholder="Areal" tabIndex="4" required />
                        <input type="text" name="room_people" id="room_people" placeholder="Antall personer" tabIndex="5" required />
                        <button className="form-button" id="alwaysActive" type="submit" tabIndex="6">Legg til</button>

                    </p>
                </form>
            </div>

            <SubTitleComponent>
                Romliste
            </SubTitleComponent>
            <Table headers={columnTitles} rows={[]} />
        </>
    );
}

export default Rooms;