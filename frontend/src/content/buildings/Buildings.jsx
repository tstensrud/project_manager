import PlusIcon from '../../assets/svg/plusIcon.svg?react';
import MinusIcon from '../../assets/svg/minusIcon.svg?react';

function Buildings() {
    return(<>
        <div className="text-container">
            <div className="summaries-wrapper">
                <h1 className="app-content-Text">Legg til bygg i prosjekt</h1>
                <form className="custom-form profile-form" method="POST" role="form">
                    <p>
                        <input type="text" name="building_name" id="building_name" placeholder="Navn på bygg" />
                        <button type="submit" className="form-button">
                            Legg til
                        </button>

                    </p>
                </form>
            </div>
            <p className="p-description">Ingen bygg lagt inn for </p>
            <div className="summaries-wrapper">
                <div className="summaries-table">
                    <div className="summaries-row header">
                        <div className="summaries-cell white">
                            bygningsnavn
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
                            <span className="supply-text"> </span> m<sup>3</sup>/h
                        </div>
                    </div>

                    <div className="summaries-row">
                        <div className="summaries-cell">
                            Avtrekk:
                        </div>
                        <div className="summaries-cell">
                            {MinusIcon && <MinusIcon />}
                            <span className="extract-text"></span> m<sup>3</sup>/h
                        </div>
                    </div>

                    <div className="summaries-row">
                        <div className="summaries-cell">
                            Prosjektert varme
                        </div>
                        <div className="summaries-cell">
                            W
                        </div>
                    </div>

                    <div className="summaries-row">
                        <div className="summaries-cell">
                            Prosjektert areal
                        </div>
                        <div className="summaries-cell">
                            m<sup>2</sup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>);
}

export default Buildings