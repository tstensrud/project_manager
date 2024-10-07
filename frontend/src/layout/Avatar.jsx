function Avatar({ letter }) {
    return (
        <div className=" flex text-center justify-center items-center font-semibold rounded-full dark:bg-dark-secondary-color border border-accent-color dark:border-dark-accent-color bg-accent-color text-secondary-color text-xl w-9 h-9 p-2">
            {letter}
        </div>
    );
}

export default Avatar;