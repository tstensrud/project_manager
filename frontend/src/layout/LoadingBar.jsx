function LoadingBar() {
    return (
        <div className="fixed w-full h-6 overflow-hidden">
            <div className="w-[30%] h-1/5 bg-accent-color dark:bg-dark-accent-color absolute top-0 left-0 animate-slide"></div>
        </div>
    );
}

export default LoadingBar