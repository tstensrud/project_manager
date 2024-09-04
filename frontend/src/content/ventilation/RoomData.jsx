import { useState } from 'react';
import Draggable from 'react-draggable';

import RoomDataRow from './RoomDataRow';

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

  const calculateMinAirFlow = () => {
    let minimumAir = 0;
    const supply = ventData.vent_data.AirSupply;
    const extract = ventData.vent_data.AirExtract;
    const min = ventData.vent_data.AirMinimum;
    const area = roomData.Area;
    const emission = ventData.vent_data.AirEmissionSum;
    const controlls = ventData.vent_data.RoomControl;
    const roomControll = controlls.slice(0,3).toUpperCase();

    if (roomControll === "CAV") {
      if (supply !== 0) {
        minimumAir = supply;
      } else {
        minimumAir = extract;
      }
      return minimumAir;
    }

    if (roomControll === "VAV") {
      if (emission > (min*area)) {
        minimumAir = emission;
      } else {
        minimumAir = min*area;
      }
      return minimumAir;
    }
  }
    
  return (
    <>
      <Draggable>
        <div className="room-info-ventilation-container" style={{ cursor: 'move' }}>
          <table className="fl-table-room-data">
            <thead>
              <tr>
                <th>
                  <strong>{roomData.RoomNumber} - <span className="table-text-grey">{roomData.RoomName}</span></strong>
                </th>
                <th>
                  <span onClick={(e) => handleClick(e, setShowRoomData)} className="room-data-close-btn">&times;</span>
                </th>
              </tr>
            </thead>
            <tbody>
            <RoomDataRow rowName="Romtype">{roomData.RoomTypeName}</RoomDataRow>
            <RoomDataRow rowName="Bygg">{roomData.BuildingName}</RoomDataRow>
            <RoomDataRow rowName="Areal">{roomData.Area} m<sup>2</sup></RoomDataRow>
            <RoomDataRow rowName="Antall personer">{roomData.RoomPopulation} stk.</RoomDataRow>
            <RoomDataRow rowName="Kommentar">{roomData.Comments}</RoomDataRow>
                     
              <tr>
                <td className='fl-table-summary-sub-title'>
                  <strong>Ventilasjonsdata oppsummert</strong>
                </td>
                <td className='fl-table-summary-sub-title'>

                </td>
              </tr>
              
              <RoomDataRow rowName="System">{ventData.vent_data.SystemName}</RoomDataRow>
              <RoomDataRow rowName="Beregnet luftmengde">{ventData.vent_data.AirDemand} m<sup>3</sup>/h</RoomDataRow>
              <RoomDataRow rowName="Beregnet luftmengde min.">{calculateMinAirFlow()} m<sup>3</sup>/h</RoomDataRow>
              <RoomDataRow rowName="Valgt tilluft"><span className="supply-text">{ventData.vent_data.AirSupply}</span> m<sup>3</sup>/h</RoomDataRow>
              <RoomDataRow rowName="Valgt avtrekk"><span className="extract-text">{ventData.vent_data.AirExtract}</span> m<sup>3</sup>/h</RoomDataRow>
              <RoomDataRow rowName="Summert personbelastning">{ventData.vent_data.AirPersonSum} m<sup>3</sup>/h</RoomDataRow>
              <RoomDataRow rowName="Summert emisjonsbelastning">{ventData.vent_data.AirEmissionSum} m<sup>3</sup>/h</RoomDataRow>
            
              <tr>
              <td className='fl-table-summary-sub-title'>
                  <strong>Grunnlagsdata ventilasjon</strong>
                </td>
                <td className='fl-table-summary-sub-title'>

                </td>
              </tr>
              <RoomDataRow rowName="Luft per person">{ventData.vent_data.AirPerPerson} m<sup>3</sup>/pers</RoomDataRow>
              <RoomDataRow rowName="Emisjonsbelastning">{ventData.vent_data.AirEmission} m<sup>3</sup>/m<sup>2</sup></RoomDataRow>
              <RoomDataRow rowName="Prosessventilasjon">{ventData.vent_data.AirProcess} m<sup>3</sup>/h</RoomDataRow>
              <RoomDataRow rowName="Minimum ventilasjon">{ventData.vent_data.AirMinimum} m<sup>3</sup>/h</RoomDataRow>
              <RoomDataRow rowName="Ventilasjonsprinsipp">{ventData.vent_data.VentilationPrinciple}</RoomDataRow>
              <RoomDataRow rowName="Varmeveksler">{ventData.vent_data.HeatExchange}</RoomDataRow>
              <RoomDataRow rowName="Styring">{ventData.vent_data.RoomControl}</RoomDataRow>
              <RoomDataRow rowName="Presiseringer">{ventData.vent_data.Notes}</RoomDataRow>
              <RoomDataRow rowName="dB teknisk utstyr">{ventData.vent_data.DbTechnical}</RoomDataRow>
              <RoomDataRow rowName="dB korridor naborom">{ventData.vent_data.DbNeighbour}</RoomDataRow>
              <RoomDataRow rowName="dB mot korridor">{ventData.vent_data.DbCorridor}</RoomDataRow>
              <RoomDataRow rowName="Kommentar"></RoomDataRow>

            </tbody>
          </table>
        </div>
      </Draggable>
    </>
  );
}

export default RoomData;