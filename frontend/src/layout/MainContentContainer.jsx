function MainContentContainer(props) {
    return (
        <div className="pb-20 overflow-y-auto overflow-x-hidden w-full h-full bg-tertiary-color text-primary-color dark:bg-dark-secondary-color dark:text-dark-primary-color pl-8 pr-8">
            {props.children}
        </div>
    );
}

export default MainContentContainer;