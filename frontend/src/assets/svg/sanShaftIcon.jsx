import { SVG_CLASS, SVG_DIMENSION } from './svgClass.js';
function sanShaftIcon() {
    return (
        <svg width={SVG_DIMENSION} height={SVG_DIMENSION} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="stroke-secondary-color dark:stroke-dark-primary-color dark:fill-dark-primary-color fill-secondary-color">
            <rect x="18" y="3" width="4" height="18"></rect>
            <rect x="10" y="8" width="4" height="13"></rect>
            <rect x="2" y="13" width="4" height="8"></rect>
        </svg>
    );
}

export default sanShaftIcon;