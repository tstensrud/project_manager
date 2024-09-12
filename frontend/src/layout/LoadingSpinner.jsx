function LoadingSpinner() {
    return (
        <>

            <div className="flex w-full h-full justify-center text-center items-center">
                <div className="flex">
                    <div className="border-4 border-tertiary-color rounded-[50%] border-t-accent-color w-5 h-5 animate-spin">
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoadingSpinner;