function LoadingBar() {
    return (
        <div className="relative w-full h-6 overflow-hidden">
            <div className="w-[20%] h-1/5 bg-accent-color dark:bg-dark-accent-color absolute animate-slide"></div>
        </div>
    );
}

export default LoadingBar