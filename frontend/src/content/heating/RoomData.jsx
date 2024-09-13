import Draggable from 'react-draggable';
import RoomDataRow from '../../layout/tableelements/RoomDataRow';
import RoomDataRowTitle from '../../layout/tableelements/RoomDataRowTitle';
import RoomDataMainTitle from '../../layout/tableelements/RoomDataMainTitle';

function RoomData({ heatingData, setShowRoomData }) {

  const handleClick = (e) => {
    setShowRoomData(false);
  }

  return (
    <>
      <Draggable>

        <div className="fixed shadow-lg shadow-background-shade border border-default-border-color dark:border-dark-default-border-color left-[25%] top-[15%] z-[1000] w-[600px] overflow-y-auto rounded-lg cursor-move" style={{ cursor: 'move' }}>
          
          <RoomDataMainTitle roomNumber={heatingData.room_data.RoomNumber} roomName={heatingData.room_data.RoomName} clickFunction={(e) => handleClick(e, setShowRoomData)} />

          <RoomDataRow rowName="Romtype" rowData={heatingData.room_data.RoomTypeName} />
          <RoomDataRow rowName="Bygg" rowData={heatingData.building_data.BuildingName} />
          <RoomDataRow rowName="Areal" rowData={``}>{heatingData.room_data.Area} m2</RoomDataRow>


          <RoomDataRowTitle title="Grunnlagsdata varme" />


          <RoomDataRow rowName="Temp. ventilasjon" rowData={``}>{heatingData.building_data.VentTemp} C&#176;</RoomDataRow>
          <RoomDataRow rowName="Luftmengde" rowData="">{heatingData.heating_data.Airflow} m3/h</RoomDataRow>
          <RoomDataRow rowName="DUT" rowData={``} >{heatingData.building_data.VentTemp} C&#176;</RoomDataRow>
          <RoomDataRow rowName="Årsmiddeltemp" rowData={``}>{heatingData.building_data.YearMidTemp} C&#176;</RoomDataRow>
          <RoomDataRow rowName="Antall personer" rowData={`${heatingData.room_data.RoomPopulation} stk.`} />
          <RoomDataRow rowName="Areal yttervegg" rowData={``}>{heatingData.heating_data.OuterWallArea} m2</RoomDataRow>
          <RoomDataRow rowName="Romhøyde" rowData={`${heatingData.heating_data.RoomHeight} m`} />
          <RoomDataRow rowName="Areal vindu/dører" rowData={``}>{heatingData.heating_data.WindowDoorArea} m2</RoomDataRow>
          <RoomDataRow rowName="Areal innervegger" rowData={``}>{heatingData.heating_data.InnerWallArea} m2</RoomDataRow>
          <RoomDataRow rowName="Areal tak" rowData={``} >{heatingData.heating_data.RoofArea} m2</RoomDataRow>
          <RoomDataRow rowName="Gulv på grunn" rowData={``}>{heatingData.heating_data.FloorGroundArea} m2</RoomDataRow>
          <RoomDataRow rowName="Gulv mot friluft" rowData={``}>{heatingData.heating_data.Airflow} m3/h</RoomDataRow>
          <RoomDataRow rowName="Luftmengde" rowData={``}>{heatingData.heating_data.FloorAirArea} m2</RoomDataRow>

          <RoomDataRowTitle title="Varmetap" />

          <RoomDataRow rowName="Varmetap kuldebroer" rowData={`${heatingData.heating_data.HeatLossColdBridge.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap transmisjon" rowData={`${heatingData.heating_data.HeatLossTransmission.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap infiltrasjon" rowData={`${heatingData.heating_data.HeatLossInfiltration.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap ventilasjon" rowData={`${heatingData.heating_data.HeatLossVentilation.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap kuldebroer" rowData={`${heatingData.heating_data.HeatLossColdBridge.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap totalt" rowData={`${heatingData.heating_data.HeatLossSum.toFixed(2)} W`} />
          <RoomDataRow rowName="Prosjektert varme" rowData={`${heatingData.heating_data.ChosenHeating.toFixed(2)} W`} />

          <RoomDataRowTitle title="Annet" />

          <RoomDataRow rowName="Sikkerhet" rowData={`${heatingData.building_data.Safety} %`} />
          <RoomDataRow rowName="Varmekilde" rowData={`${heatingData.heating_data.HeatSource}`} />
          <RoomDataRow rowName="Kommentar" rowData={``} />

        </div>
      </Draggable>
    </>
  );
}

export default RoomData;