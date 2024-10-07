import ActiveSortingButton from './formelements/ActiveSortingButton.jsx'
import SortingButton from './formelements/SortingButton.jsx';

function SortingButtons({ buildings, currentBuilding, sortButtonClick }) {
    return (
        <div className="flex flex-row justify-center pt-5 pb-5">
        {
            buildings && buildings.map((building, index) => (
                <div key={index}>
                    {
                        index === currentBuilding ? (
                            <ActiveSortingButton index={index} name={building.uid} buttonText={building.BuildingName} sortButtonClick={sortButtonClick} />
                        ) : (
                            <SortingButton index={index} name={building.uid} buttonText={building.BuildingName} sortButtonClick={sortButtonClick} />
                        )
                    }
                </div>
            ))
        }
    </div>
    );
}

export default SortingButtons;