import { useState } from 'react';

import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData'
import LoadingSpinner from '../../layout/LoadingSpinner';
import BuildingIcon from '../../assets/svg/building.svg?react';

function BuildingSummary({ buildingUid, projectId }) {

    const { data: curveData, setData, handleSubmit } = useUpdateData(`/project_api/${projectId}/sanitary/update_curve/${buildingUid}/`);
    const { data: buildingSummaryData, loading: buildingSummaryDataLoading, refetch } = useFetch(`/project_api/${projectId}/sanitary/building_summary/${buildingUid}/`);

    const translateEquipment = (name) => {
        switch (name) {
            case "sink_1_14_inch":
                return "Vask 1 1/14\"";
            case "sink_large":
                return "Vask 1\"";
            case "wc":
                return "WC";
            case "urinal":
                return "Urinal";
            case "shower":
                return "Dusj";
            case "tub":
                return "Badekar";
            case "dishwasher":
                return "Oppvaskemaskin";
            case "washing_machine":
                return "Vaskemaskin";
            case "tap_water_outlet_inside":
                return "Tapperkran innvendig";
            case "tap_water_outlet_outside":
                return "Tappekran utvendig";
            case "firehose":
                return "Brannslange"
            case "drain_75_mm":
                return "Gulvsluk 75mnm";
            case "drain_110_mm":
                return "Gulvsluk 110mm";
            case "sink_utility":
                return "Utslagsvask";
            case "drinking_fountain":
                return "Drikkefontene";
            default:
                "Err"
        }
    }

    const handleCurveChange = (e) => {
        e.preventDefault();
        if (e.target.value === "") {
            return;
        }
        const curve = { ["curve"]: e.target.value }
        setData(curve);
    }

    const handleCurveSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        refetch();
    }

    return (
        <div className="content-card">
            <div className="content-card-container">
                <div style={{ display: "flex", width: "400px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", width: "40%" }}>
                        <BuildingIcon />
                    </div>
                    <div style={{ display: "flex", width: "60%", textAlign: "center", alignItems: "center", justifyContent: "end", fontSize: "25px" }}>
                        {buildingSummaryData && buildingSummaryData.building_data.BuildingName}
                    </div>
                </div>

                {
                    buildingSummaryDataLoading && buildingSummaryDataLoading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="flex w-full flex-row">
                                <div style={{marginRight: "20px"}}>
                                Avløpskurve: 
                                </div>
                                <strong>{buildingSummaryData && buildingSummaryData.building_data.GraphCurve}</strong>
                            </div>
                            <form onSubmit={handleCurveSubmit}>
                                <p>
                                    <select className="card-select" onChange={handleCurveChange}>
                                        <option value="">- Velg avløpskurve -</option>
                                        <option value="A">Kurve A</option>
                                        <option value="B">Kurve B</option>
                                    </select>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className="card-button" type="submit">Oppdater</button>
                                </p>
                            </form>

                            <h3>Oppsummering vannmengder</h3>
                            <div className="content-card-inner-container">
                                <div className="sanitary-building-summary-equipment-header">
                                    <div className="flex justify-start w-full">
                                        <strong>Spillvann</strong>
                                    </div>
                                </div>

                                <div className="sanitary-building-summary-equipment-container">
                                    <div className="flex justify-start w-70-percent">
                                        Vannmengde
                                    </div>
                                    <div className="flex justify-end w-30-percent">
                                        {buildingSummaryData && buildingSummaryData.totals.drainage.total.toFixed(2)} L/s
                                    </div>
                                </div>

                                <div className="sanitary-building-summary-equipment-container">
                                    <div className="flex justify-start w-70-percent">
                                        Rørdim. (MA) 1:60
                                    </div>
                                    <div className="flex justify-end w-30-percent">
                                        {buildingSummaryData && buildingSummaryData.totals.drainage.pipe_siz_1_60} mm
                                    </div>
                                </div>

                                <div className="sanitary-building-summary-equipment-container">
                                    <div className="flex justify-start w-70-percent">
                                        Rørdim. (MA) vertikal
                                    </div>
                                    <div className="flex justify-end w-30-percent">
                                        {buildingSummaryData && buildingSummaryData.totals.drainage.pipe_size_vertical} mm
                                    </div>
                                </div>
                            </div>

                            <div className="content-card-inner-container">
                                <div className="sanitary-building-summary-equipment-header">
                                    <div className="flex justify-start w-full">
                                        <strong>Kaldtvann</strong>
                                    </div>
                                </div>

                                <div className="sanitary-building-summary-equipment-container">
                                    <div className="flex justify-start w-70-percent">
                                        Vannmengde
                                    </div>
                                    <div className="flex justify-end w-30-percent">
                                        {buildingSummaryData && buildingSummaryData.totals.cw.total.toFixed(2)} L/s
                                    </div>
                                </div>

                                <div className="sanitary-building-summary-equipment-container">
                                    <div className="flex justify-start w-70-percent">
                                        Rørdim. (Cu)
                                    </div>
                                    <div className="flex justify-end w-30-percent">
                                        {buildingSummaryData && buildingSummaryData.totals.cw.pipe_size} mm
                                    </div>
                                </div>
                            </div>
                            <div className="content-card-inner-container">
                                <div className="sanitary-building-summary-equipment-header">
                                    <div className="flex justify-start w-full">
                                        <strong>Varmtvann</strong>
                                    </div>
                                </div>

                                <div className="sanitary-building-summary-equipment-container">
                                    <div className="flex justify-start w-70-percent">
                                        Vannmengde
                                    </div>
                                    <div className="flex justify-end w-30-percent">
                                        {buildingSummaryData && buildingSummaryData.totals.ww.total.toFixed(2)} L/s
                                    </div>
                                </div>

                                <div className="sanitary-building-summary-equipment-container">
                                    <div className="flex justify-start w-70-percent">
                                        Rørdim. (Cu)
                                    </div>
                                    <div className="flex justify-end w-30-percent">
                                        {buildingSummaryData && buildingSummaryData.totals.ww.pipe_size} mm
                                    </div>
                                </div>
                            </div>
                            <h3>Installert sanitærustyr</h3>
                            <div className="content-card-inner-container">
                                {
                                    buildingSummaryData && Object.entries(buildingSummaryData && buildingSummaryData.building_data.sanitary_summary).map((equip, index) => (
                                        <div className="sanitary-building-summary-equipment-container" key={index}>
                                            <div className="flex justify-start w-70-percent">
                                                {translateEquipment(equip[0])}</div>
                                            <div className="flex justify-end w-30-percent">
                                                {equip[1]} stk
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default BuildingSummary;