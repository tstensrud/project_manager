function MainContentContainer(props) {
    return (
        <div className="pb-36 overflow-y-auto overflow-x-hidden w-full h-full bg-gradient-to-tr dark:from-dark-secondary-color dark:to-dark-tertiary-color bg-tertiary-color text-primary-color dark:bg-dark-tertiary-color dark:text-dark-primary-color pl-8 pr-8">
            {props.children}
        </div>
    );
}

export default MainContentContainer;