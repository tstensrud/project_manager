// Components
import ContentCard from '../../layout/ContentCard';
import VentIcon from '../../assets/svg/ventSystemIcon.jsx';
import CardTitle from '../../layout/CardTitle';

function VentilationSummary({ systemData, totalAirflow }) {

    return (
        <ContentCard width="24">
            <CardTitle svg={<VentIcon />} title="Ventilasjonsdata" />
            <div className="border-0 p-3 rounder-lg">
                {
                    systemData ? (
                        <>
                            <div className="mb-10">
                                <div className="text-grey-text dark:text-dark-grey-text mb-1">
                                    <h4>Ventilasjonssystemer</h4>
                                </div>
                                {
                                    systemData && Object.keys(systemData).map((system, index) => (
                                        <div key={index} className="flex flex-row w-full text-sm">
                                            <div className="flex">
                                                {systemData[system].SystemName}
                                            </div>
                                            <div className="flex flex-1 justify-end text-end">
                                                {systemData[system].AirSupply} m<div><sup>3</sup></div>/h
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="mb-1 text-grey-text dark:text-dark-grey-text">
                                <h4>Prosjektert luftmengde</h4>
                            </div>
                            {
                                totalAirflow ? (
                                    <>
                                        <div className="flex flex-row w-full text-sm">
                                            {totalAirflow.toLocaleString()} <div className="ml-1">m<sup>3</sup>/h</div>
                                        </div>
                                    </>
                                ) : (
                                    <>Ingen data</>
                                )
                            }
                        </>
                    ) : (
                        <>
                            Ingen data enda
                        </>
                    )
                }
            </div>
        </ContentCard>
    );
}

export default VentilationSummary;