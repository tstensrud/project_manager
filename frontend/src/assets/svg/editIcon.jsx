function editIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.dimension ? props.dimension : '24'} height={props.dimension ? props.dimension : '24'} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color dark:stroke-dark-accent-color fill-none">
            <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
            <line x1="3" y1="22" x2="21" y2="22"></line>
        </svg>

    );
}

export default editIcon;