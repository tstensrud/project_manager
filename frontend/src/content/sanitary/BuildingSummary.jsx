import { useEffect, useState } from 'react';

// hooks
import useFetch from '../../hooks/useFetch'
import useUpdateData from '../../hooks/useUpdateData'

// components
import LoadingSpinner from '../../layout/LoadingSpinner';
import ContentCard from '../../layout/ContentCard.jsx';
import CustomSelect from '../../layout/formelements/CustomSelect.jsx';
import SummaryHeader from './components/SummaryHeader.jsx';
import EquipmentContainer from './components/EquipmentContainer.jsx';
import MessageBox from '../../layout/MessageBox';
import BuildingIcon from '../../assets/svg/buildingIcon.jsx';
import CardTitle from '../../layout/CardTitle.jsx';

function BuildingSummary({ buildingUid, projectId }) {

    const { data: curveData, response, setData, handleSubmit } = useUpdateData(`/project_api/${projectId}/sanitary/update_curve/${buildingUid}/`);
    const { data: buildingSummaryData, loading: buildingSummaryDataLoading, refetch } = useFetch(buildingUid ? `/project_api/${projectId}/sanitary/building_summary/${buildingUid}/` : null);

    const curveOptions = [{ value: "A", name: "Kurve A" }, { value: "B", name: "Kurve B" }];

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

    useEffect(() => {
        if (response?.success === true) {
            refetch();
            setData('');
        }
    }, [response]);

    useEffect(() => {
        if (curveData) {
            handleCurveSubmit();
        }
    }, [curveData])

    const handleCurveChange = (curveType) => {
        if (curveType === "") {
            return;
        }
        const curve = { curve: curveType }
        setData(curve);
    }

    const handleCurveSubmit = async () => {
        await handleSubmit();
    }

    return (
        <>
            {
                response?.success === false && <MessageBox closeable={true} message={response.message} />
            }

            <ContentCard>
                <div className="flex w-[400px] mb-5">
                    <CardTitle svg={<BuildingIcon />} title={buildingSummaryData?.data?.BuildingName} />
                </div>
                {
                    buildingSummaryDataLoading && buildingSummaryDataLoading === true ? (
                        <LoadingSpinner text="sanitærdata" />
                    ) : (
                        <>
                            <div className="flex w-full flex-row mb-3 ">
                                <div className="mr-3">
                                    Avløpskurve
                                </div>
                                <strong>
                                    {buildingSummaryData && buildingSummaryData.data.GraphCurve}
                                </strong>
                            </div>

                            <div className="mb-3 flex flex-row w-full">
                                <CustomSelect selections={curveOptions} changeFunction={handleCurveChange} />
                            </div>

                            <div className="border-0 rounded-lg">
                                <SummaryHeader header="Spillvann" />
                                <EquipmentContainer type="Vannmengde">{buildingSummaryData && buildingSummaryData.totals.drainage.total.toFixed(2)} L/s</EquipmentContainer>
                                <EquipmentContainer type="Rørdim. (MA) 1:60">{buildingSummaryData && buildingSummaryData.totals.drainage.pipe_siz_1_60} mm</EquipmentContainer>
                                <EquipmentContainer type="Rørdim. (MA) vertikal">{buildingSummaryData && buildingSummaryData.totals.drainage.pipe_size_vertical} mm</EquipmentContainer>
                            </div>

                            <div className="border-0 rounded-lg pt-3">
                                <SummaryHeader header="Kaldtvann" />
                                <EquipmentContainer type="Vannmengde">{buildingSummaryData && buildingSummaryData.totals.cw.total.toFixed(2)} L/s</EquipmentContainer>
                                <EquipmentContainer type="Rørdim. (Cu)">{buildingSummaryData && buildingSummaryData.totals.cw.pipe_size} mm</EquipmentContainer>
                            </div>

                            <div className="border-0 rounded-lg pt-3">
                                <SummaryHeader header="Varmtvann" />
                                <EquipmentContainer type="Vannmengde">{buildingSummaryData && buildingSummaryData.totals.ww.total.toFixed(2)} L/s</EquipmentContainer>
                                <EquipmentContainer type="Rørdim. (Cu)">{buildingSummaryData && buildingSummaryData.totals.ww.pipe_size} mm</EquipmentContainer>
                            </div>

                            <div className="pt-4">
                                <SummaryHeader header="Installert utstyr" />
                                <div className="border-0 rounded-lg">
                                    {
                                        buildingSummaryData && Object.entries(buildingSummaryData && buildingSummaryData.data.sanitary_summary).map((equip, index) => (
                                            <EquipmentContainer type={translateEquipment(equip[0])} key={index}>{equip[1]} stk</EquipmentContainer>
                                        ))
                                    }
                                </div>
                            </div>
                        </>
                    )
                }
            </ContentCard>
        </>
    );
}

export default BuildingSummary;