import Draggable from 'react-draggable';
import RoomDataRow from '../../layout/tableelements/RoomDataRow';
import RoomDataRowTitle from '../../layout/tableelements/RoomDataRowTitle';
import RoomDataMainTitle from '../../layout/tableelements/RoomDataMainTitle';

function RoomData({ roomData, ventData, setShowRoomData }) {

  const handleClick = () => {
    setShowRoomData(false);
  };

  const calculateMinAirFlow = () => {
    let minimumAir = 0;
    const supply = ventData.vent_data.AirSupply;
    const extract = ventData.vent_data.AirExtract;
    const min = ventData.vent_data.AirMinimum;
    const area = roomData.Area;
    const emission = ventData.vent_data.AirEmissionSum;
    const controls = ventData.vent_data.RoomControl;
    const cav = controls.toUpperCase().includes("CAV");
    const vav = controls.toUpperCase().includes("VAV");

    if (cav) {
      if (supply !== 0) {
        minimumAir = supply;
      } else {
        minimumAir = extract;
      }
    }

    if (vav) {
      if (emission > (min * area)) {
        minimumAir = emission;
      } else {
        minimumAir = min * area;
      }

    }
    return minimumAir.toFixed(0);
  }

  return (
    <>
      <Draggable>
        <div className="fixed shadow-lg shadow-background-shade border border-default-border-color dark:border-dark-default-border-color left-[25%] top-[15%] z-[1000] w-[600px] overflow-y-auto rounded-lg cursor-move" style={{ cursor: 'move' }}>
          
          <RoomDataMainTitle roomNumber={roomData.RoomNumber}roomName={roomData.RoomName} clickFunction={(e) => handleClick(e, setShowRoomData)} />

          <RoomDataRow rowName="Romtype">{roomData.RoomTypeName}</RoomDataRow>
          <RoomDataRow rowName="Bygg">{roomData.BuildingName}</RoomDataRow>
          <RoomDataRow rowName="Areal">{roomData.Area} m2</RoomDataRow>
          <RoomDataRow rowName="Etasje">{roomData.Floor} </RoomDataRow>
          <RoomDataRow rowName="Antall personer">{roomData.RoomPopulation} stk.</RoomDataRow>
          <RoomDataRow rowName="Kommentar">{roomData.Comments}</RoomDataRow>
          
          <RoomDataRowTitle title="Ventilasjonsdata oppsummert" />

          <RoomDataRow rowName="System">{ventData.vent_data.SystemName}</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde">{ventData.vent_data.AirDemand} m3/h</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde min.">{calculateMinAirFlow()} m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt tilluft"><div className="text-supply-color mr-1">{ventData.vent_data.AirSupply}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt avtrekk"><div className="text-extract-color mr-1">{ventData.vent_data.AirExtract}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert personbelastning">{ventData.vent_data.AirPersonSum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert emisjonsbelastning">{ventData.vent_data.AirEmissionSum} m3/h</RoomDataRow>

          <RoomDataRowTitle title="Grunnlagsdata ventilasjon" />

          <RoomDataRow rowName="Luft per person">{ventData.vent_data.AirPerPerson} m3/pers</RoomDataRow>
          <RoomDataRow rowName="Emisjonsbelastning">{ventData.vent_data.AirEmission} m3/m2</RoomDataRow>
          <RoomDataRow rowName="Prosessventilasjon">{ventData.vent_data.AirProcess} m3/h</RoomDataRow>
          <RoomDataRow rowName="Minimum ventilasjon">{ventData.vent_data.AirMinimum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Ventilasjonsprinsipp">{ventData.vent_data.VentilationPrinciple}</RoomDataRow>
          <RoomDataRow rowName="Varmeveksler">{ventData.vent_data.HeatExchange}</RoomDataRow>
          <RoomDataRow rowName="Styring">{ventData.vent_data.RoomControl}</RoomDataRow>
          <RoomDataRow rowName="Presiseringer">{ventData.vent_data.Notes}</RoomDataRow>
          <RoomDataRow rowName="dB teknisk utstyr">{ventData.vent_data.DbTechnical}</RoomDataRow>
          <RoomDataRow rowName="dB korridor naborom">{ventData.vent_data.DbNeighbour}</RoomDataRow>
          <RoomDataRow rowName="dB mot korridor">{ventData.vent_data.DbCorridor}</RoomDataRow>
          <RoomDataRow rowName="Kommentar"></RoomDataRow>

        </div>
      </Draggable>
    </>
  );
}

export default RoomData;