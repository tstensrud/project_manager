function MainContentContainer(props) {
    return (
        <>
        <div className="pb-36 overflow-y-auto overflow-x-hidden w-full h-full bg-tertiary-color text-primary-color dark:bg-dark-tertiary-color dark:text-dark-primary-color">
            {props.children}
        </div>
        </>
    );
}

export default MainContentContainer;