import Draggable from 'react-draggable';
import RoomDataRow from './RoomDataRow';

function RoomData({ heatingData, setShowRoomData }) {

  const handleClick = (e) => {
    setShowRoomData(false);
  }

  return (
    <>
      <Draggable>
        <div className="fixed shadow-lg shadow-background-shade border border-default-border-color left-[25%] top-[15%] z-[1000] w-[600px] overflow-y-auto rounded-lg cursor-move">

          <div className="flex w-full pt-3 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
              <div className="text-lg font-semibold w-full">
                {heatingData.room_data.RoomNumber} - <span className="text-grey-text">{heatingData.room_data.RoomName}</span>
              </div>
            </div>
            <div className="flex justify-end w-1/2 pr-4 text-base">
              <span onClick={(e) => handleClick(e, setShowRoomData)} className="room-data-close-btn">
                &times;
              </span>
            </div>
          </div>

          <RoomDataRow rowName="Romtype" rowData={heatingData.room_data.RoomTypeName} />
          <RoomDataRow rowName="Bygg" rowData={heatingData.building_data.BuildingName} />
          <RoomDataRow rowName="Areal" rowData={``}>{heatingData.room_data.Area} m<sup>2</sup></RoomDataRow>

          <div className="flex w-full pt-3 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
              <div className="text-lg font-semibold w-full">
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


          <div className="flex w-full pt-3 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
              <div className="text-lg font-semibold w-full">
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

          <div className="flex w-full pt-3 pb-1 pl-5 border-b border-b-default-border-color bg-secondary-color hover:bg-tertiary-color">
            <div className="flex w-1/2">
              <div className="text-lg font-semibold w-full">
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