function LoadingRow({ cols }) {
    return (
        <>
            {
                Array.from({ length: cols }).map((_, index) => (
                    <td className="animate-pulse space-x-4">
                        <div className="flex h-8 w-full items-center">
                            <div className="animate-pulse w-full bg-grey-text  dark:bg-dark-grey-text h-2 flex space-x-4 rounded-full">
                            </div>
                        </div>
                    </td>
                ))
            }
        </>
    );
}

export default LoadingRow;