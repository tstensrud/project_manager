import Draggable from 'react-draggable';
import RoomDataRow from './RoomDataRow';

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
        <div className="fixed shadow-lg shadow-background-shade border border-default-border-color left-[25%] top-[15%] z-[1000] w-[600px] overflow-y-auto rounded-lg cursor-move" style={{ cursor: 'move' }}>

          <div className="flex items-center w-full pt-1 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
              <div className="text-lg font-semibold w-full">
                {roomData.RoomNumber} - <span className="text-grey-text">{roomData.RoomName}</span>
              </div>
            </div>
            <div className="flex justify-end w-1/2 pr-4">
              <span onClick={(e) => handleClick(e, setShowRoomData)} className="flex right-4 text-primary-color text-2xl font-bold cursor-pointer hover:text-accent-color">
                &times;
              </span>
            </div>
          </div>

          <RoomDataRow rowName="Romtype">{roomData.RoomTypeName}</RoomDataRow>
          <RoomDataRow rowName="Bygg">{roomData.BuildingName}</RoomDataRow>
          <RoomDataRow rowName="Areal">{roomData.Area} m2</RoomDataRow>
          <RoomDataRow rowName="Antall personer">{roomData.RoomPopulation} stk.</RoomDataRow>
          <RoomDataRow rowName="Kommentar">{roomData.Comments}</RoomDataRow>

          <div className="flex w-full pt-1 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
              <div className="text-lg font-semibold w-full">
                Ventilasjonsdata oppsummert
              </div>
            </div>
          </div>

          <RoomDataRow rowName="System">{ventData.vent_data.SystemName}</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde">{ventData.vent_data.AirDemand} m3/h</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde min.">{calculateMinAirFlow()} m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt tilluft"><div className="text-supply-color mr-1">{ventData.vent_data.AirSupply}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt avtrekk"><div className="text-extract-color mr-1">{ventData.vent_data.AirExtract}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert personbelastning">{ventData.vent_data.AirPersonSum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert emisjonsbelastning">{ventData.vent_data.AirEmissionSum} m3/h</RoomDataRow>

          <div className="flex w-full pt-1 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
              <div className="text-lg font-semibold w-full">
                Grunnlagsdata ventilasjon
              </div>
            </div>
          </div>

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