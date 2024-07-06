import React from 'react';

function BuildingSummary({data}) {
    return(
        <>
            <div className="summaries-wrapper">
                <div className="summaries-table">
                    <div className="summary-container ">

                        <div className="left">
                            <div className="summaries-title">
                                {data && data.BuildingName} <br/>
                                oppsummert
                            </div>
                        </div>

                        <div className="top">
                            <div className="summaries-row">
                                <div className="summaries-cell">
                                    Dimensjonert
                                </div>
                                <div className="summaries-cell">
                                {data && data.demand}  m<sup>3</sup>/h
                                </div>
                            </div>
                        </div>

                        <div className="mid">
                            <div className="summaries-row">
                                <div className="summaries-cell">
                                    Prosjektert tilluft
                                </div>
                                <div className="summaries-cell">
                                {data && data.supplyAir}  m<sup>3</sup>/h
                                </div>
                            </div>
                        </div>

                        <div className="bot">
                            <div className="summaries-row">
                                <div className="summaries-cell">
                                    Prosjektert avtrekk
                                </div>
                                <div className="summaries-cell">
                                {data && data.extractAir}  m<sup>3</sup>/h
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}

export default BuildingSummary;