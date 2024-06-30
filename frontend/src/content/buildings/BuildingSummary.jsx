import PlusIcon from '../../assets/svg/plusIcon.svg?react';
import MinusIcon from '../../assets/svg/minusIcon.svg?react';

function BuildingSummary({buildingData}) {

    const buildingName = buildingData.BuildingName;
    const area = buildingData.area;
    const supplyAir = buildingData.supplyAir;
    const extractAir = buildingData.extractAir;
    const heating = buildingData.heating;


    return (<>
    <div className="summaries-wrapper">
                <div className="summaries-table">
                    <div className="summaries-row header">
                        <div className="summaries-cell white">
                            {buildingName}
                        </div>
                        <div className="summaries-cell">
                        </div>
                    </div>

                    <div className="summaries-row header blue">
                        <div className="summaries-cell white">
                            Prosjektert
                        </div>
                        <div className="summaries-cell">
                        </div>
                    </div>

                    <div className="summaries-row">
                        <div className="summaries-cell">
                            Tilluft:
                        </div>
                        <div className="summaries-cell">
                            {PlusIcon && <PlusIcon />}
                            <span className="supply-text"> {supplyAir} </span> m<sup>3</sup>/h
                        </div>
                    </div>

                    <div className="summaries-row">
                        <div className="summaries-cell">
                            Avtrekk:
                        </div>
                        <div className="summaries-cell">
                            {MinusIcon && <MinusIcon />}
                            <span className="extract-text"> {extractAir} </span> m<sup>3</sup>/h
                        </div>
                    </div>

                    <div className="summaries-row">
                        <div className="summaries-cell">
                            Prosjektert varme
                        </div>
                        <div className="summaries-cell">
                           {heating} W
                        </div>
                    </div>

                    <div className="summaries-row">
                        <div className="summaries-cell">
                            Prosjektert areal
                        </div>
                        <div className="summaries-cell">
                           {area} m<sup>2</sup>
                        </div>
                    </div>
                </div>
            </div>
    </>);
}

export default BuildingSummary;