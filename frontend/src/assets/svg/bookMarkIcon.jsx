function bookMarkIcon({width, height, primary}) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" strokeWidth="2" className={primary ? "stroke-secondary-color dark:stroke-dark-primary-color fill-none" : `stroke-accent-color dark:stroke-dark-accent-color fill-none`} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg> 
    );
}

export default bookMarkIcon;