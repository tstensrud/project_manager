import { useState } from 'react';

// Components
import ContentCard from '../../layout/ContentCard';
import HeaderIcon from '../../assets/svg/ventSystemIcon.jsx';
import SubTitleComponent from '../../layout/SubTitleComponent';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';
import CardSelect from '../../layout/formelements/CardSelect.jsx';

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
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full">
                    <ContentCard width="20">
                        <h2>Lufthastighet kanaler</h2>
                        <div className="mt-3">
                            Luftmengde m3/h
                        </div>
                        <div className="relative w-full">
                            <CardInputField changeFunction={(e) => setAirflow(e.target.value)} name="airflow" placeholder="Luftmengde m3/h" />
                        </div>

                        <h3>Spirokanal</h3>
                        <div className="relative mt-5 w-full">
                            <CardSelect changeFunction={handleDiameterChange} name="diameter">
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
                            </CardSelect>
                        </div>

                        <div className="relative mt-5 w-full">
                            <h3>Firkantkanal</h3>
                        </div>
                        <div className="mt-3">
                            Bredde i mm
                        </div>
                        <div className="relative w-full">
                            <CardInputField changeFunction={(e) => setWidth(e.target.value)} name="width" placeholder="Bredde mm" />
                        </div>
                        <div className="mt-3">
                            Høyde i mm
                        </div>
                        <div className="relative w-full">
                            <CardInputField changeFunction={(e) => setHeight(e.target.value)} name="height" placeholder="Høyde mm" />
                        </div>
                        <div className="relative mt-5 w-full">
                            <CardButton clickFunction={calculate} buttonText="Beregn" />
                        </div>
                        <div className="relative mt-5 w-full">
                            <h3>Beregnede hastigheter</h3>
                            <br />
                            {warning}
                            {
                                resultCiruclar !== 0 &&
                                <div className="flex flex-row w-full">
                                    <div className="grey-text w-1/2">
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
                                    <div className="grey-text w-1/2">
                                        Firkantkanal:
                                    </div>
                                    <div>
                                        <strong>{resultSquare} m/s</strong>
                                    </div>
                                </div>
                            }
                        </div>
                    </ContentCard>
                </div>
            </MainContentContainer >
        </>
    );
}

export default CalculatorSpeedAirflowDucts;