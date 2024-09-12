function NewRoom() {
    return (
        <form id="new_room" onSubmit={handleOnSubmit}>
            <p>Legg til nytt rom</p>
            <p>

                <select ref={roomTypeRef} onChange={handleFormChange} name="roomType">
                    <option key="0" value="">- Velg romtype -</option>
                    {roomTypeData && roomTypeData.spec_room_type_data !== undefined && roomTypeData.spec_room_type_data.map(type => (<option key={type.uid} value={type.uid}>{type.name}</option>))};
                </select>
                &nbsp; &nbsp;
                <select name="buildingUid" onChange={handleFormChange}>
                    <option key="0" value="">- Velg bygg -</option>
                    {buildingData && buildingData.building_data && Object.keys(buildingData.building_data).map((key, index) => (<option key={index} value={buildingData.building_data[key].uid}>{buildingData.building_data[key].BuildingName}</option>))}
                </select>
                &nbsp; &nbsp;
                <input className="input-short" type="text" name="floor" onChange={handleFormChange} placeholder="Etasje" tabIndex="1" required /> &nbsp; &nbsp;
                <input ref={inputRoomNumberRef} className="input-short" type="text" name="roomNumber" onChange={handleFormChange} placeholder="Romnr." tabIndex="2" required /> &nbsp; &nbsp;
                <input ref={inputRoomNameRef} type="text" name="roomName" onChange={handleFormChange} placeholder="Romnavn" tabIndex="3" required /> &nbsp; &nbsp;
                <input ref={inputAreaRef} className="input-short" type="text" name="roomArea" onChange={handleFormChange} placeholder="Areal" tabIndex="4" required /> &nbsp; &nbsp;
                <input ref={inputPopRef} className="input-short" type="text" name="roomPeople" onChange={handleFormChange} placeholder="Personer" tabIndex="5" required /> &nbsp; &nbsp;
                <button className="form-button" type="submit" tabIndex="6">Legg til</button>
            </p>
        </form>
    );
}

export default NewRoom;