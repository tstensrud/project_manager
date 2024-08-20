import PlusIcon from '../../assets/svg/plusIcon.svg?react';
import MinusIcon from '../../assets/svg/minusIcon.svg?react';
import DeleteIcon from '../../assets/svg/deleteIcon.svg?react';
import BuildingIcon from '../../assets/svg/buildingIcon.svg?react';
import EditIcon from '../../assets/svg/editIcon.svg?react';
import CardTitle from '../../layout/CardTitle';

function BuildingSummary({ buildingData }) {

    const buildingName = buildingData.BuildingName || '';
    const area = buildingData.area || '';
    const supplyAir = buildingData.supplyAir || '';
    const extractAir = buildingData.extractAir || '';
    const heating = buildingData.heating || '';


    return (<>

        <div className="cards">
            <div className="information [ card ]">
                <CardTitle svg={<BuildingIcon />} title={buildingName} />

                <p className="info">Prosjektert areal<br />
                    {area.toLocaleString()} m<sup>2</sup>
                </p>

                <p className="info">Prosjektert luftmengde<br />
                    {PlusIcon && <PlusIcon />}
                    <span className="supply-text"> {supplyAir.toLocaleString()} </span> m<sup>3</sup>/h
                    <br />
                    {MinusIcon && <MinusIcon />}
                    <span className="extract-text"> {extractAir.toLocaleString()} </span> m<sup>3</sup>/h
                </p>
                <p>Betjenes av ventilasjonssystem:</p>
                <ul>
                    {
                        buildingData.systems.map((system, index) => <><li key={index}>{system}</li></>)
                    }
                </ul>
                <p className="info">Prosjektert varme<br />
                    {Number((heating / 1000).toFixed(1)).toLocaleString()} kW
                </p>
                <div style={{ display: "flex", marginTop: "50px", width: "100%", textAlign: "end", justifyContent: "end" }}>
                    <EditIcon /> &nbsp; Rediger bygg
                </div>
            </div>
        </div>
    </>);
}

export default BuildingSummary;