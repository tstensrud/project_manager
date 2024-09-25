function LoadingSpinner({ text }) {
    return (
        <>

            <div className="flex w-full h-full justify-center text-center">
                <div className="flex">
                    <div className="border-4 border-tertiary-color dark:border-dark-tertiary-color rounded-[50%] border-t-accent-color dark:border-t-dark-accent-color w-5 h-5 animate-spin mr-1">
                    </div>
                    <div className="flex items-center h-full mr-1">
                        {
                            text ? 'Laster' : ''
                        }
                    </div>
                    <div className="flex items-center h-full">
                        {text}
                    </div>

                </div>
            </div>
        </>
    );
}

export default LoadingSpinner;