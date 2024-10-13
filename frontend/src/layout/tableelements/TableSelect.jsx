function TableSelect({ currentSystemName, systems, handleSystemChange }) {

    return (
        <div className="
        group
        flex
        flex-col
        rounded-lg
        hover:rounded-tl-lg
        rounded-tr-lg
        hover:rounded-bl-none
        hover:rounded-br-none
        bg-tertiary-color
        dark:bg-dark-tertiary-color
        relative
        ">
            <div className="bg-tertiary-color dark:bg-dark-tertiary-color p-1 rounded-lg cursor-default flex flex-row">
                <div className="w-[10%]">

                </div>
                <div className="flex flex-1 justify-center">
                    {currentSystemName && currentSystemName}

                </div>
                <div className="flex justify-end items-center w-[10%]">
                    <div className="w-full rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-color dark:stroke-dark-primary-color fill-none cursor-pointer">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="
            hidden
            group-hover:bg-tertiary-color
            group-hover:dark:bg-dark-tertiary-color
            group-hover:w-full
            group-hover:rounded-lg
             group-hover:absolute
             group-hover:block
             group-hover:z-[9999]
             group-hover:top-full
             group-hover:left-0
             group-hover:rounded-tl-none
             group-hover:rounded-tr-none
             cursor-pointer
             shadow-sm
            group-hover:shadow-background-shade
            group-hover:dark:shadow-dark-background-shade
            dark:shadow-dark-background-shade
            ">
                {
                    systems && Object.keys(systems)
                        .sort((a, b) => {
                            const systemA = systems[a].SystemName;
                            const systemB = systems[b].SystemName;

                            return systemA.localeCompare(systemB)
                        }
                        )
                        .map((key, index) => {
                            if (systems[key].SystemName === currentSystemName) {
                                return null;
                            }
                            return (
                                <div onClick={() => handleSystemChange(systems[key].uid)} key={index} className="bg-tertiary-color dark:bg-dark-tertiary-color hover:bg-primary-color hover:text-secondary-color hover:dark:bg-dark-table-hover p-1 rounded-lg w-full">
                                    {systems[key].SystemName}
                                </div>
                            )
                        })
                }
            </div>
        </div>
    );
}

export default TableSelect;