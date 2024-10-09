import { useNavigate } from "react-router-dom";

function Linkbutton({ text, url, icon, onClick }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (url) {
            navigate(url)
        }
        if (onClick) {
            onClick(e);
        }
    }
    return (
        <div onClick={handleClick} className="group items-center cursor-pointer h-12 border rounded-lg bg-secondary-color dark:bg-dark-secondary-color hover:bg-accent-color hover:border-accent-color dark:border-dark-default-border-color hover:dark:border-dark-accent-color transition duration-300 w-fit flex flex-row">
            <div className="flex items-start justify-end h-full pl-3 pr-1">
                {
                    icon &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" class="stroke-primary-color dark:stroke-dark-primary-color fill-none">
                        <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3">
                        </path><line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                }
            </div>
            <div className="h-full flex items-center pr-3 text-primary-color dark:text-dark-primary-color group-hover:text-secondary-color group-hoverdark:text-dark-primary-color transition duration-300">
                {text}
            </div>
        </div>
    );

}

export default Linkbutton;