function Message({ data }) {

    return (
        <div className="mt-3 mb-3 flex flex-col text-sm border rounded-lg border-default-border-color dark:border-dark-default-border-color">
            <div className="flex flex-row border-b border-default-border-color dark:border-dark-default-border-color">
                <div className="flex flex-row p-3">
                    {data.userData.name}
                </div>
                <div className="flex flex-row flex-1 p-3 text-grey-text dark:text-dark-grey-text text-end justify-end">
                    {data.messageData.timestamp}
                </div>
            </div>
            <div className="whitespace-pre-wrap p-3">
                {data.messageData.message}
            </div>

            <div className="flex flex-row p-3">
                <div className="pr-3">
                    <button className="border border-accent-color dark:border-dark-accent-color pl-2 pr-2 rounded-lg text-primary-color dark:text-dark-primary-color hover:text-secondary-color hover:bg-accent-color hover:dark:bg-dark-navbar-hover-bg-color duration-300">Åpne tråd</button>
                </div>
                <div className="pr-3">
                    <button className="border border-accent-color dark:border-dark-accent-color pl-2 pr-2 rounded-lg text-primary-color dark:text-dark-primary-color hover:text-secondary-color hover:bg-accent-color hover:dark:bg-dark-navbar-hover-bg-color duration-300">Merk lest</button>
                </div>
                <div className="pr-3">
                    <button className="border border-accent-color dark:border-dark-accent-color pl-2 pr-2 rounded-lg text-primary-color dark:text-dark-primary-color hover:text-secondary-color hover:bg-accent-color hover:dark:bg-dark-navbar-hover-bg-color duration-300">Slett</button>
                </div>
            </div>
        </div>
    );
}

export default Message