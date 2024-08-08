import Draggable from 'react-draggable';

function RoomData({heatingData, setShowRoomData}) {
    
    const handleClick = (e) => {
        setShowRoomData(false);
    }

  return (
    <>
      <Draggable>
        <div className="room-info-ventilation-container" style={{ cursor: 'move' }}>
          <table className="fl-table-room-data">
            <thead>
              <th>
                <strong>{heatingData.room_data.RoomNumber} - {heatingData.room_data.RoomName}</strong>
              </th>
              <th>
                <span onClick={(e) => handleClick(e, setShowRoomData)} className="room-data-close-btn">&times;</span>
              </th>
            </thead>
            <tbody>

              <tr>
                <td>
                  Romtype
                </td>
                <td>
                  {heatingData.room_data.RoomTypeName}
                </td>
              </tr>

              <tr>
                <td>
                  Bygg
                </td>
                <td>
                  {heatingData.building_data.BuildingName}
                </td>
              </tr>

              <tr>
                <td>
                  Areal
                </td>
                <td>
                  {heatingData.room_data.Area} m<sup>2</sup>
                </td>
              </tr>

              <tr>
                <td className='fl-table-summary-sub-title'>
                  <strong>Grunnlagsdata varme</strong>
                </td>
                <td className='fl-table-summary-sub-title'>

                </td>
              </tr>

              <tr>
                <td>
                  Temp. ventilasjon
                </td>
                <td>
                  {heatingData.building_data.VentTemp} C&#176;
                </td>
              </tr>

              <tr>
                <td>
                  Luftmengde
                </td>
                <td>
                  {heatingData.heating_data.Airflow} m<sup>3</sup>/h
                </td>
              </tr>

              <tr>
                <td>
                  DUT
                </td>
                <td>
                  {heatingData.building_data.Dut} C&#176;
                </td>
              </tr>

              <tr>
                <td>
                  Årsmiddeltemp
                </td>
                <td>
                  {heatingData.building_data.YearMidTemp} C&#176;
                </td>
              </tr>

              <tr>
                <td>
                  Antall personer
                </td>
                <td>
                  {heatingData.room_data.RoomPopulation} stk.
                </td>
              </tr>

              <tr>
                <td>
                  Areal yttervegg
                </td>
                <td>
                  {heatingData.heating_data.OuterWallArea} m<sup>2</sup>
                </td>
              </tr>

              <tr>
                <td>
                  Romhøyde
                </td>
                <td>
                  {heatingData.heating_data.RoomHeight} m
                </td>
              </tr>

              <tr>
                <td>
                  Areal vindu/dører
                </td>
                <td>
                  {heatingData.heating_data.WindowDoorArea} m<sup>2</sup>
                </td>
              </tr>

              <tr>
                <td>
                  Areal innervegger
                </td>
                <td>
                  {heatingData.heating_data.InnerWallArea} m<sup>2</sup>
                </td>
              </tr>

              <tr>
                <td>
                  Areal tak
                </td>
                <td>
                  {heatingData.heating_data.RoofArea} m<sup>2</sup>
                </td>
              </tr>

              <tr>
                <td>
                  Gulv på grunn
                </td>
                <td>
                  {heatingData.heating_data.FloorGroundArea} m<sup>2</sup>
                </td>
              </tr>

              <tr>
                <td>
                  Gulv mot friluft
                </td>
                <td>
                  {heatingData.heating_data.FloorAirArea} m<sup>2</sup>
                </td>
              </tr>

              <tr>
              <td className='fl-table-summary-sub-title'>
                  <strong>Varmetap</strong>
                </td>
                <td className='fl-table-summary-sub-title'>
                  
                </td>
              </tr>

              <tr>
                <td>
                  Varmetap kuldebroer
                </td>
                <td>
                  {heatingData.heating_data.HeatLossColdBridge} W
                </td>
              </tr>

              <tr>
                <td>
                  Varmetap transmisjon
                </td>
                <td>
                  {heatingData.heating_data.HeatLossTransmission} W
                </td>
              </tr>

              <tr>
                <td>
                  Varmetap infiltrasjon
                </td>
                <td>
                  {heatingData.heating_data.HeatLossInfiltration} W
                </td>
              </tr>

              <tr>
                <td>
                  Varmetap ventilasjon
                </td>
                <td>
                  {heatingData.heating_data.HeatLossVentilation} W
                </td>
              </tr>

              <tr>
                <td>
                  Varmetap totalt
                </td>
                <td>
                  {heatingData.heating_data.HeatLossSum} W
                </td>
              </tr>

              <tr>
                <td>
                  Prosjektert varme
                </td>
                <td>
                  {heatingData.heating_data.ChosenHeating} W
                </td>
              </tr>

              <tr>
              <td className='fl-table-summary-sub-title'>
                  <strong>Annet</strong>
                </td>
                <td className='fl-table-summary-sub-title'>
                  
                </td>
              </tr>

              <tr>
                <td>
                  Sikkerhet
                </td>
                <td>
                  {heatingData.building_data.Safety} %
                </td>
              </tr>

              <tr>
                <td>
                  Varmekilde
                </td>
                <td>
                  {heatingData.heating_data.HeatSource}
                </td>
              </tr>

              <tr>
                <td>
                  Kommentar
                </td>
                <td>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Draggable>
    </>
  );
}

export default RoomData;