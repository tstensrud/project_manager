import RoomDataRow from '../../layout/tableelements/RoomDataRow';
import RoomDataRowTitle from '../../layout/tableelements/RoomDataRowTitle';
import RoomDataMainTitle from '../../layout/tableelements/RoomDataMainTitle';

function RoomData({ roomData, ventData, setShowRoomData }) {

  const handleClick = () => {
    setShowRoomData(false);
  };

  const calculateMinAirFlow = () => {
    let minimumAir = 0;
    const supply = ventData.AirSupply;
    const extract = ventData.AirExtract;
    const min = ventData.AirMinimum;
    const area = roomData.Area;
    const emission = ventData.AirEmissionSum;
    const controls = ventData.RoomControl;
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
  console.log(roomData)
  return (
    <>
      <div className="fixed h-full w-full justify-center items-center z-[1000] left-0 top-0 bg-background-shade">
      <div className="fixed shadow-lg bg-secondary-color dark:bg-dark-secondary-color shadow-background-shade border border-default-border-color dark:border-dark-default-border-color top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] h-1/2 w-[450px] overflow-y-auto rounded-lg">
          
          <RoomDataMainTitle roomNumber={roomData.roomData.RoomNumber}roomName={roomData.roomData.RoomName} clickFunction={(e) => handleClick(e, setShowRoomData)} />

          <RoomDataRow rowName="Romtype">{roomData.roomType}</RoomDataRow>
          <RoomDataRow rowName="Bygg">{roomData.buildingName}</RoomDataRow>
          <RoomDataRow rowName="Areal">{roomData.roomData.Area} m2</RoomDataRow>
          <RoomDataRow rowName="Etasje">{roomData.roomData.Floor} </RoomDataRow>
          <RoomDataRow rowName="Antall personer">{roomData.roomData.RoomPopulation} stk.</RoomDataRow>
          <RoomDataRow rowName="Kommentar">{roomData.roomData.Comments}</RoomDataRow>
          
          <RoomDataRowTitle title="Ventilasjonsdata oppsummert" />

          <RoomDataRow rowName="System">{ventData.SystemName}</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde">{ventData.AirDemand} m3/h</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde min.">{calculateMinAirFlow()} m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt tilluft"><div className="text-supply-color mr-1">{ventData.AirSupply}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt avtrekk"><div className="text-extract-color mr-1">{ventData.AirExtract}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert personbelastning">{ventData.AirPersonSum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert emisjonsbelastning">{ventData.AirEmissionSum} m3/h</RoomDataRow>

          <RoomDataRowTitle title="Grunnlagsdata ventilasjon" />

          <RoomDataRow rowName="Luft per person">{ventData.AirPerPerson} m3/pers</RoomDataRow>
          <RoomDataRow rowName="Emisjonsbelastning">{ventData.AirEmission} m3/m2</RoomDataRow>
          <RoomDataRow rowName="Prosessventilasjon">{ventData.AirProcess} m3/h</RoomDataRow>
          <RoomDataRow rowName="Minimum ventilasjon">{ventData.AirMinimum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Ventilasjonsprinsipp">{ventData.VentilationPrinciple}</RoomDataRow>
          <RoomDataRow rowName="Varmeveksler">{ventData.HeatExchange}</RoomDataRow>
          <RoomDataRow rowName="Styring">{ventData.RoomControl}</RoomDataRow>
          <RoomDataRow rowName="Presiseringer">{ventData.Notes}</RoomDataRow>
          <RoomDataRow rowName="dB teknisk utstyr">{ventData.DbTechnical}</RoomDataRow>
          <RoomDataRow rowName="dB korridor naborom">{ventData.DbNeighbour}</RoomDataRow>
          <RoomDataRow rowName="dB mot korridor">{ventData.DbCorridor}</RoomDataRow>
          <RoomDataRow rowName="Kommentar"></RoomDataRow>

        </div>
      </div>
    </>
  );
}

export default RoomData;