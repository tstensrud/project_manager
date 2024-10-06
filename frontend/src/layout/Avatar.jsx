function Avatar({ letter }) {
    return (
        <div className=" flex text-center justify-center font-semibold rounded-full dark:bg-dark-tertiary-color bg-tertiary-color text-xl w-11 p-2">
            {letter}
        </div>
    );
}

export default Avatar;