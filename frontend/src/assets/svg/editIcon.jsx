function editIcon({height, width, primary}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={primary ? "stroke-primary-color dark:stroke-dark-primary-color fill-none" : `stroke-accent-color dark:stroke-dark-accent-color fill-none`}>
            <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
            <line x1="3" y1="22" x2="21" y2="22"></line>
        </svg>

    );
}

export default editIcon;