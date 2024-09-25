function HelpBox({ title, sections, setShowHelpBox }) {

    return (
        <div className="fixed h-full w-full justify-center items-center z-[1000] left-0 top-0 bg-background-shade">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="bg-tertiary-color dark:bg-dark-secondary-color flex flex-col pl-5 pr-5 rounded-lg w-[30%] h-[50%] overflow-y-auto shadow-lg shadow-background-shade border border-default-border-color dark:border-dark-default-border-color">
                    <div className="w-full flex justify-end bg-tertiary-color dark:bg-dark-secondary-color sticky top-0 pt-3">
                        <div className="cursor-pointer text-accent-color dark:text-dark-accent-color" onClick={setShowHelpBox}>Lukk</div>
                    </div>
                    <div className="w-full flex flex-col">
                        <div className="text-lg font-semibold">
                            {title}
                        </div>
                        {
                            sections.map((section, index) => (
                                <div key={index} className="mt-1 mb-1">
                                    <div className="text-grey-text text-lg dark:text-dark-grey-text">
                                        {section.subTitle}
                                    </div>
                                    <div className="text-base">
                                        {section.text}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpBox;