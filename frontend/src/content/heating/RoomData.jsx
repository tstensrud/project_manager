import RoomDataRow from '../../layout/tableelements/RoomDataRow';
import RoomDataRowTitle from '../../layout/tableelements/RoomDataRowTitle';
import RoomDataMainTitle from '../../layout/tableelements/RoomDataMainTitle';

function RoomData({ setShowRoomData, roomData, roomTypeData, buildingData }) {

  const handleClick = (e) => {
    setShowRoomData(false);
  }
  
  return (
    <div className="fixed h-full w-full justify-center items-center z-[1000] left-0 top-0 bg-background-shade">
      <div className="fixed shadow-lg bg-secondary-color dark:bg-dark-secondary-color shadow-background-shade border border-default-border-color dark:border-dark-default-border-color top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] h-1/2 w-[450px] overflow-y-auto rounded-lg">

        <RoomDataMainTitle roomNumber={roomData?.roomData.RoomNumber} roomName={roomData?.roomData.RoomName} clickFunction={(e) => handleClick(e, setShowRoomData)} />

        <RoomDataRow rowName="Romtype" rowData="">{roomTypeData.name}</RoomDataRow>
        <RoomDataRow rowName="Bygg" rowData="">{buildingData.BuildingName}</RoomDataRow>
        <RoomDataRow rowName="Etasje" rowData="">{roomData?.roomData.Floor}</RoomDataRow>
        <RoomDataRow rowName="Areal" rowData={``}>{roomData?.roomData.Area} m2</RoomDataRow>
        <RoomDataRow rowName="Antall personer" rowData="">{roomData.RoomPopulation} stk.</RoomDataRow>

        <RoomDataRowTitle title="Varmetap" />

        <RoomDataRow rowName="Varmetap kuldebroer" rowData={``}>{roomData?.roomData.HeatLossColdBridge.toFixed(2)} W</RoomDataRow>
        <RoomDataRow rowName="Varmetap transmisjon" rowData="" >{roomData?.roomData.HeatLossTransmission.toFixed(2)}W</RoomDataRow>
        <RoomDataRow rowName="Varmetap infiltrasjon" rowData={``}>{roomData?.roomData.HeatLossInfiltration.toFixed(2)} W</RoomDataRow>
        <RoomDataRow rowName="Varmetap ventilasjon" rowData="" >{roomData?.roomData.HeatLossVentilation.toFixed(2)} W</RoomDataRow>
        <RoomDataRow rowName="Varmetap totalt" rowData="">{roomData?.roomData.HeatLossSum.toFixed(2)} W </RoomDataRow>
        <RoomDataRow rowName="Prosjektert varme" rowData="">{roomData?.roomData.ChosenHeating.toFixed(2)} W</RoomDataRow>

        <RoomDataRowTitle title="Grunnlagsdata varme" />
        <RoomDataRow rowName="Temp. ventilasjon" rowData={``}>{buildingData?.VentTemp} C&#176;</RoomDataRow>
        <RoomDataRow rowName="Temp inne vinter" rowData={``}>{buildingData?.InsideTemp} C&#176;</RoomDataRow>
        <RoomDataRow rowName="DUT" rowData={``} >{buildingData?.Dut} C&#176;</RoomDataRow>
        <RoomDataRow rowName="Årsmiddeltemp" rowData={``}>{buildingData?.YearMidTemp} C&#176;</RoomDataRow>
        <RoomDataRow rowName="Areal yttervegg" rowData={``}>{roomData?.roomData.OuterWallArea} m2</RoomDataRow>
        <RoomDataRow rowName="Romhøyde" rowData="">{roomData?.roomData.RoomHeight} m</RoomDataRow>
        <RoomDataRow rowName="Areal vindu/dører" rowData={``}>{roomData?.roomData.WindowDoorArea} m2</RoomDataRow>
        <RoomDataRow rowName="Areal innervegger" rowData={``}>{roomData?.roomData.InnerWallArea} m2</RoomDataRow>
        <RoomDataRow rowName="Areal tak" rowData={``} >{roomData?.roomData.RoofArea} m2</RoomDataRow>
        <RoomDataRow rowName="Gulv på grunn" rowData={``}>{roomData?.roomData.FloorGroundArea} m2</RoomDataRow>
        <RoomDataRow rowName="Kuldebroverdi" rowData={``}>{buildingData?.ColdBridge}</RoomDataRow>
        <RoomDataRow rowName="Gulv mot friluft" rowData={``}>{roomData?.roomData.FloorAirArea} m2</RoomDataRow>
        <RoomDataRow rowName="Luftmengde" rowData={``}>{roomData?.roomData.AirSupply} m3/h</RoomDataRow>
        <RoomDataRow rowName="Infiltrasjon" rowData={``}>{buildingData?.Infiltration}</RoomDataRow>
        <RoomDataRow rowName="Sikkerhet" rowData="">{buildingData?.Safety} %</RoomDataRow>

        <RoomDataRowTitle title="U-verdier" />
        <RoomDataRow rowName="Yttervegg" rowData="">{buildingData?.UvalueOuterWall} W/m2K</RoomDataRow>
        <RoomDataRow rowName="Vindu og dører" rowData="">{buildingData?.UvalueWindowDoor} W/m2K</RoomDataRow>
        <RoomDataRow rowName="Gulv mot grunn" rowData="">{buildingData?.UvalueFloorGround} W/m2K</RoomDataRow>
        <RoomDataRow rowName="Gulv mot fritt" rowData="">{buildingData?.UvalueFloorAir} W/m2K</RoomDataRow>
        <RoomDataRow rowName="Tak" rowData="">{buildingData?.UvalueRoof} W/m2K</RoomDataRow>
        

        <RoomDataRowTitle title="Annet" />
        <RoomDataRow rowName="Varmekilde" rowData="">{roomData?.roomData.HeatSource}</RoomDataRow>
        <RoomDataRow rowName="Kommentar" rowData={``}></RoomDataRow>

      </div>
    </div>
  );
}

export default RoomData;