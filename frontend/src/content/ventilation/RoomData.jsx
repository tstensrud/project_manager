import { useState } from 'react';
import Draggable from 'react-draggable';

function RoomData({roomData, ventData, setShowRoomData}) {
    
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
      setShowRoomData(false);
  };
    
  return (
    <>
      <Draggable>
        <div className="room-info-ventilation-container" style={{ cursor: 'move' }}>
          <table className="fl-table-room-data">
            <thead>
              <tr>
                <th>
                  <strong>{roomData.room_data.RoomNumber} - <span className="table-text-grey">{roomData.room_data.RoomName}</span></strong>
                </th>
                <th>
                  <span onClick={(e) => handleClick(e, setShowRoomData)} className="room-data-close-btn">&times;</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Romtype
                </td>
                <td>
                  {roomData.room_data.RoomTypeName}
                </td>
              </tr>

              <tr>
                <td>
                  Bygg
                </td>
                <td>
                  {roomData.room_data.BuildingName}
                </td>
              </tr>

              <tr>
                <td>
                  Areal
                </td>
                <td>
                  {roomData.room_data.Area} m<sup>2</sup>
                </td>
              </tr>

              <tr>
                <td>
                  Antall personer
                </td>
                <td>
                  {roomData.room_data.RoomPopulation} stk.
                </td>
              </tr>

              <tr>
                <td>
                  Kommentar
                </td>
                <td>
                  - Ingen kommentar
                </td>
              </tr>

              <tr>
                <td className='fl-table-summary-sub-title'>
                  Ventilasjonsdata oppsummert
                </td>
                <td className='fl-table-summary-sub-title'>

                </td>
              </tr>

              <tr>
                <td>
                  System
                </td>
                <td>
                  {ventData.vent_data.SystemName}
                </td>
              </tr>

              <tr>
                <td>
                  Beregnet luftmengde
                </td>
                <td>
                  {ventData.vent_data.AirDemand} m<sup>3</sup>/h
                </td>
              </tr>

              <tr>
                <td>
                  Valgt tilluft
                </td>
                <td>
                  {ventData.vent_data.AirSupply} m<sup>3</sup>/h
                </td>
              </tr>

              <tr>
                <td>
                  Valgt avtrekk
                </td>
                <td>
                  {ventData.vent_data.AirExtract} m<sup>3</sup>/h
                </td>
              </tr>

              <tr>
                <td>
                  Summert personbelastning
                </td>
                <td>
                  {ventData.vent_data.AirPersonSum} m<sup>3</sup>/h
                </td>
              </tr>

              <tr>
                <td>
                  Summert emisjonsbelastning
                </td>
                <td>
                  {ventData.vent_data.AirEmissionSum} m<sup>3</sup>/h
                </td>
              </tr>
              <tr>
              <td className='fl-table-summary-sub-title'>
                  Grunnlagsdata ventilasjon
                </td>
                <td className='fl-table-summary-sub-title'>

                </td>
              </tr>
              <tr>
                <td>
                  Luft per person
                </td>
                <td>
                  {ventData.vent_data.AirPerPerson} m<sup>3</sup>/pers
                </td>
              </tr>
              <tr>
                <td>
                  Emisjonsbelastning
                </td>
                <td>
                  {ventData.vent_data.AirEmission} m<sup>3</sup>/m<sup>2</sup>
                </td>
              </tr>
              <tr>
                <td>
                  Prosessventilasjon
                </td>
                <td>
                  {ventData.vent_data.AirProcess} m<sup>3</sup>/h
                </td>
              </tr>
              <tr>
                <td>
                  Minimum ventilasjon
                </td>
                <td>
                  {ventData.vent_data.AirMinimum} m<sup>3</sup>/h
                </td>
              </tr>
              <tr>
                <td>
                  Ventilasjonsprinsipp
                </td>
                <td>
                  {ventData.vent_data.VentilationPrinciple}
                </td>
              </tr>

              <tr>
                <td>
                  Varmeveksler
                </td>
                <td>
                  {ventData.vent_data.HeatExchange}
                </td>
              </tr>
              <tr>
                <td>
                  Styring
                </td>
                <td>
                  {ventData.vent_data.RoomControl}
                </td>
              </tr>
              <tr>
                <td>
                  Presiseringer
                </td>
                <td style={{wordWrap: "break-word", wordBreak: "break-all", whiteSpace: "normal"}}>
                  {ventData.vent_data.Notes}
                </td>
              </tr>
              <tr>
                <td>
                  dB teknisk utstyr
                </td>
                <td>
                  {ventData.vent_data.DbTechnical}
                </td>
              </tr>
              <tr>
                <td>
                  dB korridor naborom
                </td>
                <td>
                  {ventData.vent_data.DbNeighbour}
                </td>
              </tr>

              <tr>
                <td>
                  dB korridor naborom
                </td>
                <td>
                  {ventData.vent_data.DbNeighbour}
                </td>
              </tr>

              <tr>
                <td>
                  dB mot korridor
                </td>
                <td>
                  {ventData.vent_data.DbCorridor}
                </td>
              </tr>

              <tr>
                <td>
                  Kommentarer
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