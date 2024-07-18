import PlusIcon from '../../assets/svg/plusIcon.svg?react';
import MinusIcon from '../../assets/svg/minusIcon.svg?react';

function BuildingSummary({buildingData}) {

    const buildingName = buildingData.BuildingName || '';
    const area = buildingData.area || '';
    const supplyAir = buildingData.supplyAir || '';
    const extractAir = buildingData.extractAir || '';
    const heating = buildingData.heating || '';


    return (<>

                <div className="cards">
                    <div className="information [ card ]">
                        <h2 className="card-title"> {buildingName}</h2>
                        <p className="info">Prosjektert areal<br/>
                        {area.toLocaleString()} m<sup>2</sup>
                        </p>
                        
                        <p className="info">Prosjektert luftmengde<br/>
                        {PlusIcon && <PlusIcon />}
                            <span className="supply-text"> {supplyAir.toLocaleString()} </span> m<sup>3</sup>/h
                        <br />
                        {MinusIcon && <MinusIcon />}
                        <span className="extract-text"> {extractAir.toLocaleString()} </span> m<sup>3</sup>/h
                        </p>

                        <p>
                            Betjenes av ventilasjonssystem: <br />
                            <ul>
                            {
                                buildingData.systems.map((system) => <><li>{system}</li></>)
                            }
                            </ul>
                        </p>

                        <p className="info">Prosjektert varme<br/>
                        {Number((heating / 1000).toFixed(1)).toLocaleString()} kW
                        </p>
                    </div>
                </div>
    </>);
}

export default BuildingSummary;