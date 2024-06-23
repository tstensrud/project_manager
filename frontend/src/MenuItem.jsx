function MenuItem({item}) {

    const {text, svg: SvgIcon, url} = item;

    return (
        <>
        <li className="sidebar-list-item">
            <a href={url}>
            {SvgIcon && <SvgIcon />}
            <span>{text}</span>
            </a>
        </li>
        </>
    );
}

export default MenuItem