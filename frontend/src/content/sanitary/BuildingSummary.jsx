import { useState } from 'react';

import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData'
import LoadingSpinner from '../../layout/LoadingSpinner';

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
        <>
            <div className="cards">
                <div className="information [ card ]">
                    <h2 className="card-title"> {buildingSummaryData && buildingSummaryData.building_data.BuildingName}</h2>
                    {
                        buildingSummaryDataLoading && buildingSummaryDataLoading === true ? (
                            <>
                                <LoadingSpinner />
                            </>
                        ) : (
                            <>
                                Avløpskurve: <strong>{buildingSummaryData && buildingSummaryData.building_data.GraphCurve}</strong>
                                <form onSubmit={handleCurveSubmit}>
                                    <p>
                                        <select onChange={handleCurveChange}>
                                            <option value="">- Velg avløpskurve -</option>
                                            <option value="A">Kurve A</option>
                                            <option value="B">Kurve B</option>
                                        </select>
                                        &nbsp;&nbsp;&nbsp;
                                        <button className="form-button" type="submit">Oppdater</button>
                                    </p>
                                </form>
                                <h3>Oppsummering vannmengder</h3>
                                    <div className="sanitary-building-summary-equipment-header">
                                        <div style={{ display: "flex", justifyContent: "start", width: "100%" }}>
                                            <strong>Spillvann</strong>
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-container">
                                        <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                            Vannmengde
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                            {buildingSummaryData && buildingSummaryData.totals.drainage.total.toFixed(2)} L/s
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-container">
                                        <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                            Rørdimensjon 1:60
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                            {buildingSummaryData && buildingSummaryData.totals.drainage.pipe_siz_1_60} mm
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-container">
                                        <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                            Rørdimensjon vertikal
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                            {buildingSummaryData && buildingSummaryData.totals.drainage.pipe_size_vertical} mm
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-header">
                                        <div style={{ display: "flex", justifyContent: "start", width: "100%" }}>
                                            <strong>Kaldtvann</strong>
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-container">
                                        <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                            Vannmengde
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                        {buildingSummaryData && buildingSummaryData.totals.cw.total.toFixed(2)} L/s
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-container">
                                        <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                            Rørdimenjson
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                        {buildingSummaryData && buildingSummaryData.totals.cw.pipe_size} mm
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-header">
                                        <div style={{ display: "flex", justifyContent: "start", width: "100%" }}>
                                            <strong>Varmtvann</strong>
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-container">
                                        <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                            Vannmengde
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                        {buildingSummaryData && buildingSummaryData.totals.ww.total.toFixed(2)} L/s
                                        </div>
                                    </div>

                                    <div className="sanitary-building-summary-equipment-container">
                                        <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                            Rørdimensjon
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                        {buildingSummaryData && buildingSummaryData.totals.ww.pipe_size} mm
                                        </div>
                                    </div>

                                <h3>Installert sanitærustyr</h3>
                                {
                                    buildingSummaryData && Object.entries(buildingSummaryData && buildingSummaryData.building_data.sanitary_summary).map((equip) => (
                                        <>
                                            <div className="sanitary-building-summary-equipment-container">
                                                <div style={{ display: "flex", justifyContent: "start", width: "70%" }}>
                                                    {translateEquipment(equip[0])}</div>
                                                <div style={{ display: "flex", justifyContent: "end", width: "30%" }}>
                                                    {equip[1]} stk
                                                </div>
                                            </div>

                                        </>
                                    ))
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default BuildingSummary;