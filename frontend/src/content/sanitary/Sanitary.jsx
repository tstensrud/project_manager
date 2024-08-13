import TapwaterIcon from '../../assets/svg/tapWaterIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';

function Sanitary() {
    return (
        <>
            <SubTitleComponent>
                <TapwaterIcon /> Sanitæranlegg - oppsummering
            </SubTitleComponent>
            
            <div className='main-content'>
                <div className="cards">
                    <div className="information [ card ]">
                        <h2 className="card-title"></h2>
                        <p className="info">Prosjektert areal<br />

                        </p>

                        <p className="info">Prosjektert luftmengde<br />

                            <span className="supply-text"> </span> m<sup>3</sup>/h
                            <br />

                            <span className="extract-text"> </span> m<sup>3</sup>/h
                        </p>

                        <p>
                            Betjenes av ventilasjonssystem: <br />
                            <ul>

                            </ul>
                        </p>

                        <p className="info">Prosjektert varme<br />

                        </p>
                        <p style={{ textAlign: "end" }}>

                        </p>
                    </div>
                </div>


            </div>
        </>
    );
}

export default Sanitary;