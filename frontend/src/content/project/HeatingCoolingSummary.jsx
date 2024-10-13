// Components
import ContentCard from '../../layout/ContentCard';
import HeatingIcon from '../../assets/svg/heatingIcon.jsx';
import CardTitle from '../../layout/CardTitle';

function HeatingSummary({ totalHeating, totalCooling }) {

    return (
        <ContentCard width="24">
            <CardTitle svg={<HeatingIcon />} title="Varme- og kjøledata" />
            <div className="border-0 p-3 rounder-lg">
                <div className="text-grey-text dark:text-dark-grey-text mb-1">
                    <h4>Prosjektert varmetap</h4>
                </div>
                <div className="mb-10 text-sm">
                    {
                        totalHeating ? (
                            <>
                                {((totalHeating / 1000).toFixed(2)).toLocaleString()} kW
                            </>
                        ) : (
                            <>
                                Ingen data
                            </>
                        )
                    }
                </div>
                <div className="text-grey-text dark:text-dark-grey-text mb-1">
                    <h4>Tilført kjøling</h4>
                </div>
                <div className="text-sm">
                {
                        totalCooling ? (
                            <>
                                {((totalCooling / 1000).toFixed(2)).toLocaleString()} kW
                            </>
                        ) : (
                            <>
                                Ingen data
                            </>
                        )
                    }
                </div>
            </div>
        </ContentCard>
    );
}

export default HeatingSummary;