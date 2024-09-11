import { useState } from 'react';
import HeaderIcon from '../../assets/svg/ventSystemIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent';

function CalculatorSpeedAirflowDucts() {
    const [diameter, setDiameter] = useState(0);
    const [airflow, setAirflow] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [resultCiruclar, setResultCiruclar] = useState(0);
    const [resultSquare, setResultSquare] = useState(0);
    const [warning, setWarning] = useState("");

    // Handlers
    const handleDiameterChange = (e) => {
        setDiameter(e.target.value)
    }

    const calculate = (e) => {
        e.preventDefault();
        setWarning("");
        if (airflow === 0) {
            setWarning("Mangler luftmengde");
            return;
        }

        const airflowToMpS = airflow / 3600;

        if (diameter !== 0) {
            const area = Math.pow(((diameter / 1000) / 2), 2) * Math.PI;
            const speed = (airflowToMpS / area);
            setResultCiruclar(speed.toFixed(2));
        }

        if (width && height) {
            const area = (width / 1000) * (height / 1000);
            const speed = (airflowToMpS / area);
            setResultSquare(speed.toFixed(2));
        }
    }

    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Kalkulator - lufthastighet kanaler"} projectName={""} projectNumber={""} />
            <div className="main-content">
                <div className="flex-container-row">
                    <div className="content-card">
                        <div className="content-card-container">
                            <h2 className="card-title">Lufthastighet kanaler</h2>
                            <div className="input-container">
                                <input onChange={(e) => setAirflow(e.target.value)} className="input-container-input" name="airflow" placeholder='Luftmengde m3/h' />
                                <label htmlFor="input-field" className="input-label">Luftmengde m<sup>3</sup>/h</label>
                            </div>

                            <h3>Spirokanal</h3>
                            <div className="input-container">
                                <select onChange={handleDiameterChange} className="card-select" name="diameter">
                                    <option>- Kanaldimensjon -</option>
                                    <option value="80">Ø 80</option>
                                    <option value="100">Ø 100</option>
                                    <option value="125">Ø 125</option>
                                    <option value="160">Ø 160</option>
                                    <option value="200">Ø 200</option>
                                    <option value="250">Ø 250</option>
                                    <option value="315">Ø 315</option>
                                    <option value="400">Ø 400</option>
                                    <option value="500">Ø 500</option>
                                    <option value="630">Ø 630</option>
                                    <option value="800">Ø 800</option>
                                    <option value="1000">Ø 1000</option>
                                    <option value="1250">Ø 1250</option>
                                </select>
                            </div>

                            <div className="input-container">
                                <h3>Firkantkanal</h3>
                            </div>
                            <div className="input-container">
                                <input onChange={(e) => setWidth(e.target.value)} name="width" className="input-container-input" placeholder='Bredde mm' />
                                <label htmlFor="input-field" className="input-label">Bredde mm</label>
                            </div>
                            <div className="input-container">
                                <input onChange={(e) => setHeight(e.target.value)} name="height" className="input-container-input" placeholder='Høyde mm' />
                                <label htmlFor="input-field" className="input-label">Høyde mm</label>
                            </div>
                            <div className="input-container">
                                <button onClick={calculate} className="card-button">Beregn</button>
                            </div>
                            <div className="input-container">
                                <h3>Hastigheter</h3>
                                <br />
                                {warning}
                                {
                                    resultCiruclar !== 0 &&
                                    <div className="flex flex-row w-full">
                                        <div className="grey-text w-half">
                                            Spirokanal:
                                        </div>
                                        <div>
                                            <strong>{resultCiruclar} m/s</strong>
                                        </div>
                                    </div>
                                }
                                <br />
                                {
                                    resultSquare !== 0 &&
                                    <div className="flex flex-row w-full">
                                        <div className="grey-text w-half">
                                            Firkantkanal:
                                        </div>
                                        <div>
                                            <strong>{resultSquare} m/s</strong>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CalculatorSpeedAirflowDucts;