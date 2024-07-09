function RoomData({roomData, ventData, setShowRoomData}) {
    
    const handleClick = (e) => {
        setShowRoomData(false);
    }
    return (
        <>
        <div className="room-info-ventilation-container">
            <div className="room-info-ventilation-popup">
            
            <div className="room-data-wrapper">
            
      <div className="room-data-table">
        <div className="room-data-header">
          <div className="room-data-cell white">
           <strong>{roomData.room_data.RoomNumber} - {roomData.room_data.RoomName}</strong>
          </div>
          
          <div className="room-data-cell white">
          <span onClick={(e) => handleClick(e, setShowRoomData)} className="room-data-close-btn">&times;</span>
          </div>
        </div>
        <div className="room-data-row">
          <div className="room-data-cell">
            Romtype
          </div>
          <div className="room-data-cell">
          {roomData.room_data.RoomTypeName}
          </div>
        </div>
        
        <div className="room-data-row">
          <div className="room-data-cell">
            Bygg
          </div>
          <div className="room-data-cell">
          {roomData.room_data.BuildingName}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Areal
          </div>
          <div className="room-data-cell">
          {roomData.room_data.Area} m<sup>2</sup>
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Antall personer
          </div>
          <div className="room-data-cell">
          {roomData.room_data.RoomPopulation} stk.
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Kommentar
          </div>
          <div className="room-data-cell">
         
          </div>
        </div>

        <div className="room-data-header blue">
          <div className="room-data-cell white">
            Ventilasjonsdata oppsummert
          </div>
          <div className="room-data-cell">
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            System
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.SystemName}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
          Beregnet luftmengde
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirDemand} m<sup>3</sup>/h
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Valgt tilluft
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirSupply} m<sup>3</sup>/h
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Valgt avtrekk
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirExtract} m<sup>3</sup>/h
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Summert personbelastning
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirPersonSum} m<sup>3</sup>/h
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Summert emisjonsbelastning
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirEmissionSum} m<sup>3</sup>/h
          </div>
        </div>

        <div className="room-data-header blue">
          <div className="room-data-cell white">
            Grunnlagsdata ventilasjon
          </div>
          <div className="room-data-cell">
          
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Luft per person
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirPerPerson} m<sup>3</sup>/pers
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Emisjonsbelastning
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirEmission} m<sup>3</sup>/m<sup>2</sup>
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Prosessventilasjon
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirProcess} m<sup>3</sup>/h
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Minimum ventilasjon
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.AirMinimum} m<sup>3</sup>/h
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Ventilasjonsprinsipop
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.VentilationPrinciple}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Varmeveksler
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.HeatExchange}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Styring
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.RoomControl}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Presiseringer
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.Notes}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            dB teknisk utstyr
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.DbTechnical}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            dB korridor naborom
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.DbNeighbour}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            dB mot korridor
          </div>
          <div className="room-data-cell">
          {ventData.vent_data.DbCorridor}
          </div>
        </div>

        <div className="room-data-row">
          <div className="room-data-cell">
            Kommentarer
          </div>
          <div className="room-data-cell">

          </div>
        </div>

      </div>
    </div>
            </div>
        </div>
        </>
    );
}

export default RoomData;