function ContentCard({ children, width }) {
    const widths = {
        20: 'sm:w-[20rem]', // 320px
        24: 'sm:w-[24rem]', // 384px
        28: 'sm:w-[28rem]', // 448px
        32: 'sm:w-[32rem]', // 512px
        36: 'sm:w-[36rem]', // 576px
        40: 'sm:w-[40rem]', // 640px
        44: 'sm:w-[44rem]', // 704px
        full: 'sm:w-full'
    }
    return (
        <div className={`flex flex-col w-full ${widths[width]} p-4  bg-secondary-color dark:bg-dark-tertiary-color rounded-lg mt-5`}>
            {children}
        </div>
    );
}

export default ContentCard;