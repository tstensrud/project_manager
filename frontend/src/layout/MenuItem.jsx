import { Link } from 'react-router-dom';
function MenuItem({item, isActive, onClick}) {

    const {text, svg: SvgIcon, url} = item;

    return (
        <>
        <li
        className={`sidebar-list-item ${isActive ? 'active' : ''}`}
        onClick={onClick}
        >
            <Link to={url}>
            {SvgIcon && <SvgIcon />}
            <span>{text}</span>
            </Link>
        </li>
        </>
    );
}

export default MenuItem