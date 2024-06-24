import { Link } from 'react-router-dom';
function MenuItem({item}) {

    const {text, svg: SvgIcon, url} = item;

    return (
        <>
        <li className="sidebar-list-item">
            <Link to={url}>
            {SvgIcon && <SvgIcon />}
            <span>{text}</span>
            </Link>
        </li>
        </>
    );
}

export default MenuItem