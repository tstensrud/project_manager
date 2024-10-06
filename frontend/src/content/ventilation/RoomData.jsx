import RoomDataRow from '../../layout/tableelements/RoomDataRow';
import RoomDataRowTitle from '../../layout/tableelements/RoomDataRowTitle';
import RoomDataMainTitle from '../../layout/tableelements/RoomDataMainTitle';

function RoomData({ roomData, ventData, setShowRoomData }) {

  const handleClick = () => {
    setShowRoomData(false);
  };

  const calculateMinAirFlow = () => {
    let minimumAir = 0;
    const supply = ventData.data.AirSupply;
    const extract = ventData.data.AirExtract;
    const min = ventData.data.AirMinimum;
    const area = roomData.Area;
    const emission = ventData.data.AirEmissionSum;
    const controls = ventData.data.RoomControl;
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
      <div className="fixed h-full w-full justify-center items-center z-[1000] left-0 top-0 bg-background-shade">
      <div className="fixed shadow-lg bg-secondary-color dark:bg-dark-secondary-color shadow-background-shade border border-default-border-color dark:border-dark-default-border-color top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] h-1/2 w-[450px] overflow-y-auto rounded-lg">
          
          <RoomDataMainTitle roomNumber={roomData.RoomNumber}roomName={roomData.RoomName} clickFunction={(e) => handleClick(e, setShowRoomData)} />

          <RoomDataRow rowName="Romtype">{roomData.RoomTypeName}</RoomDataRow>
          <RoomDataRow rowName="Bygg">{roomData.BuildingName}</RoomDataRow>
          <RoomDataRow rowName="Areal">{roomData.Area} m2</RoomDataRow>
          <RoomDataRow rowName="Etasje">{roomData.Floor} </RoomDataRow>
          <RoomDataRow rowName="Antall personer">{roomData.RoomPopulation} stk.</RoomDataRow>
          <RoomDataRow rowName="Kommentar">{roomData.Comments}</RoomDataRow>
          
          <RoomDataRowTitle title="Ventilasjonsdata oppsummert" />

          <RoomDataRow rowName="System">{ventData.data.SystemName}</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde">{ventData.data.AirDemand} m3/h</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde min.">{calculateMinAirFlow()} m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt tilluft"><div className="text-supply-color mr-1">{ventData.data.AirSupply}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt avtrekk"><div className="text-extract-color mr-1">{ventData.data.AirExtract}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert personbelastning">{ventData.data.AirPersonSum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert emisjonsbelastning">{ventData.data.AirEmissionSum} m3/h</RoomDataRow>

          <RoomDataRowTitle title="Grunnlagsdata ventilasjon" />

          <RoomDataRow rowName="Luft per person">{ventData.data.AirPerPerson} m3/pers</RoomDataRow>
          <RoomDataRow rowName="Emisjonsbelastning">{ventData.data.AirEmission} m3/m2</RoomDataRow>
          <RoomDataRow rowName="Prosessventilasjon">{ventData.data.AirProcess} m3/h</RoomDataRow>
          <RoomDataRow rowName="Minimum ventilasjon">{ventData.data.AirMinimum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Ventilasjonsprinsipp">{ventData.data.VentilationPrinciple}</RoomDataRow>
          <RoomDataRow rowName="Varmeveksler">{ventData.data.HeatExchange}</RoomDataRow>
          <RoomDataRow rowName="Styring">{ventData.data.RoomControl}</RoomDataRow>
          <RoomDataRow rowName="Presiseringer">{ventData.data.Notes}</RoomDataRow>
          <RoomDataRow rowName="dB teknisk utstyr">{ventData.data.DbTechnical}</RoomDataRow>
          <RoomDataRow rowName="dB korridor naborom">{ventData.data.DbNeighbour}</RoomDataRow>
          <RoomDataRow rowName="dB mot korridor">{ventData.data.DbCorridor}</RoomDataRow>
          <RoomDataRow rowName="Kommentar"></RoomDataRow>

        </div>
      </div>
    </>
  );
}

export default RoomData;