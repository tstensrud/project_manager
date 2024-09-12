function MainContentContainer(props) {
    return (
        <>
        <div className="overflow-y-auto overflow-x-hidden w-full h-full bg-tertiary-color text-primary-color">
            {props.children}
        </div>
        </>
    );
}

export default MainContentContainer;