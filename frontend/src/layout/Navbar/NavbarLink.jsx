import { Link } from "react-router-dom";

function NavbarLink(props) {
    const url = props.url;
    return (
        <>
            <div className="mb-1">
                <Link className="text-primary-color dark:text-dark-primary-color hover:dark:text-dark-accent-color font-semibold hover:text-accent-color transition duration-200 hover:no-underline" to={url}>
                    {props.linkText}
                </Link>
            </div>
        </>
    );
}

export default NavbarLink;