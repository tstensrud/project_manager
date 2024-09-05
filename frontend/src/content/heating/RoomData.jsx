import Draggable from 'react-draggable';
import RoomDataRow from './RoomDataRow';

function RoomData({ heatingData, setShowRoomData }) {

  const handleClick = (e) => {
    setShowRoomData(false);
  }

  return (
    <>
      <Draggable>
        <div className="room-info-ventilation-container" style={{ cursor: 'move' }}>

          <div className="room-data-row-container">
            <div className="room-data-row-left">
              <div className="room-data-header">
                {heatingData.room_data.RoomNumber} - <span className="table-text-grey">{heatingData.room_data.RoomName}</span>
              </div>
            </div>
            <div className="room-data-row-right">
              <span onClick={(e) => handleClick(e, setShowRoomData)} className="room-data-close-btn">
                &times;
              </span>
            </div>
          </div>

          <RoomDataRow rowName="Romtype" rowData={heatingData.room_data.RoomTypeName} />
          <RoomDataRow rowName="Bygg" rowData={heatingData.building_data.BuildingName} />
          <RoomDataRow rowName="Areal" rowData={``}>{heatingData.room_data.Area} m<sup>2</sup></RoomDataRow>

          <div className="room-data-row-container">
            <div className="room-data-row-left">
              <div className="room-data-header">
                Grunnlagsdata varme
              </div>
            </div>
          </div>

          <RoomDataRow rowName="Temp. ventilasjon" rowData={``}>{heatingData.building_data.VentTemp} C&#176;</RoomDataRow>
          <RoomDataRow rowName="Luftmengde" rowData="">{heatingData.heating_data.Airflow} m<sup>3</sup>/h</RoomDataRow>
          <RoomDataRow rowName="DUT" rowData={``} >{heatingData.building_data.VentTemp} C&#176;</RoomDataRow>
          <RoomDataRow rowName="Årsmiddeltemp" rowData={``}>{heatingData.building_data.YearMidTemp} C&#176;</RoomDataRow>
          <RoomDataRow rowName="Antall personer" rowData={`${heatingData.room_data.RoomPopulation} stk.`} />
          <RoomDataRow rowName="Areal yttervegg" rowData={``}>{heatingData.heating_data.OuterWallArea} m<sup>2</sup></RoomDataRow>
          <RoomDataRow rowName="Romhøyde" rowData={`${heatingData.heating_data.RoomHeight} m`} />
          <RoomDataRow rowName="Areal vindu/dører" rowData={``}>{heatingData.heating_data.WindowDoorArea} m<sup>2</sup></RoomDataRow>
          <RoomDataRow rowName="Areal innervegger" rowData={``}>{heatingData.heating_data.InnerWallArea} m<sup>2</sup></RoomDataRow>
          <RoomDataRow rowName="Areal tak" rowData={``} >{heatingData.heating_data.RoofArea} m<sup>2</sup></RoomDataRow>
          <RoomDataRow rowName="Gulv på grunn" rowData={``}>{heatingData.heating_data.FloorGroundArea} m<sup>2</sup></RoomDataRow>
          <RoomDataRow rowName="Gulv mot friluft" rowData={``}>{heatingData.heating_data.Airflow} m<sup>3</sup>/h</RoomDataRow>
          <RoomDataRow rowName="Luftmengde" rowData={``}>{heatingData.heating_data.FloorAirArea} m<sup>2</sup></RoomDataRow>


          <div className="room-data-row-container">
            <div className="room-data-row-left">
              <div className="room-data-header">
                Varmetap
              </div>
            </div>
          </div>

          <RoomDataRow rowName="Varmetap kuldebroer" rowData={`${heatingData.heating_data.HeatLossColdBridge.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap transmisjon" rowData={`${heatingData.heating_data.HeatLossTransmission.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap infiltrasjon" rowData={`${heatingData.heating_data.HeatLossInfiltration.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap ventilasjon" rowData={`${heatingData.heating_data.HeatLossVentilation.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap kuldebroer" rowData={`${heatingData.heating_data.HeatLossColdBridge.toFixed(2)} W`} />
          <RoomDataRow rowName="Varmetap totalt" rowData={`${heatingData.heating_data.HeatLossSum.toFixed(2)} W`} />
          <RoomDataRow rowName="Prosjektert varme" rowData={`${heatingData.heating_data.ChosenHeating.toFixed(2)} W`} />

          <div className="room-data-row-container">
            <div className="room-data-row-left">
              <div className="room-data-header">
                Annet
              </div>
            </div>
          </div>


          <RoomDataRow rowName="Sikkerhet" rowData={`${heatingData.building_data.Safety} %`} />
          <RoomDataRow rowName="Varmekilde" rowData={`${heatingData.heating_data.HeatSource}`} />
          <RoomDataRow rowName="Kommentar" rowData={``} />

        </div>
      </Draggable>
    </>
  );
}

export default RoomData;