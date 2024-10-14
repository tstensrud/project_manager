import RoomDataRow from '../../layout/tableelements/RoomDataRow';
import RoomDataRowTitle from '../../layout/tableelements/RoomDataRowTitle';
import RoomDataMainTitle from '../../layout/tableelements/RoomDataMainTitle';

function RoomData({ roomData, setShowRoomData }) {

  const handleClick = () => {
    setShowRoomData(false);
  };
console.log(roomData)
  return (
    <>
      <div className="fixed h-full w-full justify-center items-center z-[1000] left-0 top-0 bg-background-shade">
        <div className="fixed shadow-lg bg-secondary-color dark:bg-dark-secondary-color shadow-background-shade border border-default-border-color dark:border-dark-default-border-color top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] h-1/2 w-[450px] overflow-y-auto rounded-lg">

          <RoomDataMainTitle roomNumber={roomData?.roomData ? roomData.roomData.RoomNumber : roomData?.data?.roomData?.RoomNumber} roomName={roomData?.roomData ? roomData.roomData.RoomName : roomData?.data?.roomData?.RoomName} clickFunction={(e) => handleClick(e, setShowRoomData)} />

          <RoomDataRow rowName="Romtype">{roomData?.roomData ? roomData?.roomTypeData.name : roomData?.data?.roomTypeData.name}</RoomDataRow>
          <RoomDataRow rowName="Bygg">{roomData?.roomData ? roomData?.buildingData.BuildingName : roomData?.data?.buildingData.BuildingName}</RoomDataRow>
          <RoomDataRow rowName="Areal">{roomData?.roomData ? roomData.roomData.Area : roomData?.data?.roomData?.Area} m2</RoomDataRow>
          <RoomDataRow rowName="Etasje">{roomData?.roomData ? roomData.roomData.Floor : roomData?.data?.roomData?.Floor} </RoomDataRow>
          <RoomDataRow rowName="Antall personer">{roomData?.roomData ? roomData.roomData.RoomPopulation : roomData?.data?.roomData?.RoomPopulation} stk.</RoomDataRow>
          <RoomDataRow rowName="Kommentar">{roomData?.roomData ? roomData.roomData.Comments : roomData?.data?.roomData?.Comments}</RoomDataRow>

          <RoomDataRowTitle title="Ventilasjonsdata oppsummert" />

          <RoomDataRow rowName="System">{roomData?.roomData ? roomData?.ventSystemData?.SystemName : roomData?.data?.ventSystemData?.SystemName}</RoomDataRow>
          <RoomDataRow rowName="Beregnet luftmengde">{roomData?.roomData ? roomData.roomData.AirDemand : roomData?.data?.roomData?.AirDemand} m3/h</RoomDataRow>
          <RoomDataRow rowName="Minimum luftmengde">{roomData?.roomData ? roomData.roomData.AirMinimum : roomData?.data?.roomData?.AirMinimum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt tilluft"><div className="text-supply-color mr-1">{roomData?.roomData ? roomData.roomData.AirSupply : roomData?.data?.roomData?.AirSupply}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Valgt avtrekk"><div className="text-extract-color mr-1">{roomData?.roomData ? roomData.roomData.AirExtract : roomData?.data?.roomData?.AirExtract}</div> m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert personbelastning">{roomData?.roomData ? roomData.roomData.AirPersonSum : roomData?.data?.roomData?.AirPersonSum} m3/h</RoomDataRow>
          <RoomDataRow rowName="Summert emisjonsbelastning">{roomData?.roomData ? roomData.roomData.AirEmissionSum : roomData?.data?.roomData?.AirEmissionSum} m3/h</RoomDataRow>

          <RoomDataRowTitle title="Grunnlagsdata ventilasjon" />

          <RoomDataRow rowName="Luft per person">{roomData?.roomData ? roomData.roomData.AirPerPerson : roomData?.data?.roomData?.AirPerPerson} m3/pers</RoomDataRow>
          <RoomDataRow rowName="Luft per areal">{roomData?.roomData ? roomData.roomData.AirPerArea : roomData?.data?.roomData?.AirPerArea} m3/m2</RoomDataRow>
          <RoomDataRow rowName="Emisjonsbelastning">{roomData?.roomData ? roomData.roomData.AirEmission : roomData?.data?.roomData?.AirEmission} m3/m2</RoomDataRow>
          <RoomDataRow rowName="Prosessventilasjon">{roomData?.roomData ? roomData.roomData.AirProcess : roomData?.data?.roomData?.AirProcess} m3/h</RoomDataRow>
          <RoomDataRow rowName="Ventilasjonsprinsipp">{roomData?.roomData ? roomData.roomData.VentilationPrinciple : roomData?.data?.roomData?.VentilationPrinciple}</RoomDataRow>
          <RoomDataRow rowName="Varmeveksler">{roomData?.roomData ? roomData.roomData.HeatExchange : roomData?.data?.roomData?.HeatExchange}</RoomDataRow>
          <RoomDataRow rowName="Styring">{roomData?.roomData ? roomData.roomData.RoomControl : roomData?.data?.roomData?.RoomControl}</RoomDataRow>
          <RoomDataRow rowName="Presiseringer">{roomData?.roomData ? roomData.roomData.Notes : roomData?.data?.roomData?.Notes}</RoomDataRow>
          <RoomDataRow rowName="dB teknisk utstyr">{roomData?.roomData ? roomData.roomData.DbTechnical : roomData?.data?.roomData?.DbTechnical}</RoomDataRow>
          <RoomDataRow rowName="dB korridor naborom">{roomData?.roomData ? roomData.roomData.DbNeighbour : roomData?.data?.roomData?.DbNeighbour}</RoomDataRow>
          <RoomDataRow rowName="dB mot korridor">{roomData?.roomData ? roomData.roomData.DbCorridor : roomData?.data?.roomData?.DbCorridor}</RoomDataRow>
          <RoomDataRow rowName="Kommentar"></RoomDataRow>

        </div>
      </div>
    </>
  );
}

export default RoomData;