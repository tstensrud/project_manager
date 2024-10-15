function LampLogo({ menuPinned, showMenu }) {
    return (

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="37" height="37" viewBox="0 0 1800 1800" xml:space="preserve" className="dark:stroke-none dark:fill-dark-accent-color">
            <g>
                <path d="M1304.016,1574.496h-210.088c-18.638-114.862-119.3-202.092-243.578-207.916L407.561,923.791
		c13.76-18.541,21.918-41.481,21.918-66.292c0-23.781-7.513-45.826-20.252-63.945l371.323-371.323
		c-14.206,116.245,24.754,235.776,110.417,321.43c6.104,6.104,14.108,9.158,22.11,9.158c8.001,0,16.007-3.054,22.114-9.162
		l126.512-126.511c0.018,0.022,0.035,0.043,0.052,0.061c36.198,36.202,84.324,56.136,135.521,56.136
		c51.192,0,99.318-19.934,135.521-56.131c36.198-36.202,56.131-84.328,56.131-135.52c0-51.193-19.938-99.323-56.14-135.521
		c-0.018-0.018-0.039-0.035-0.057-0.053l105.893-105.893c12.212-12.216,12.212-32.014,0-44.229
		c-73.124-73.12-170.353-113.393-273.775-113.393c-49.339,0-98.874,9.603-144.561,27.904L947.67,37.89
		c-19.244-19.24-44.831-29.837-72.042-29.837c-27.21,0-52.798,10.597-72.046,29.841l-70.729,70.733
		c-39.714,39.723-39.714,104.353,0,144.08l64.381,64.381l-437.196,437.2c-12.979-5.305-27.158-8.25-42.018-8.25
		c-61.458,0-111.459,50.002-111.459,111.46c0,61.463,50.001,111.464,111.459,111.464c13.769,0,26.958-2.525,39.143-7.115
		l412.673,412.678c-98.581,24.637-173.751,102.289-189.601,199.971H370.146c-17.272,0-31.272,14-31.272,31.272v156.907
		c0,17.271,14,31.271,31.272,31.271h933.87c17.272,0,31.272-14,31.272-31.271v-156.907
		C1335.288,1588.496,1321.288,1574.496,1304.016,1574.496z M1288.567,390.4c24.384,24.384,37.816,56.803,37.816,91.291
		c0,34.487-13.429,66.907-37.816,91.291c-24.384,24.388-56.803,37.816-91.291,37.816c-34.487,0-66.907-13.429-91.29-37.812
		c-0.022-0.022-0.044-0.039-0.065-0.057l182.59-182.59C1288.532,390.357,1288.55,390.383,1288.567,390.4z M777.082,208.482
		c-15.335-15.34-15.335-40.295,0-55.634l70.725-70.729c7.43-7.43,17.312-11.521,27.821-11.521s20.392,4.092,27.817,11.521
		l86.758,86.754c0.301,0.322,0.598,0.637,0.877,0.92c9.323,9.319,23.488,11.797,35.43,6.183
		c42.864-20.169,90.701-30.827,138.339-30.827c76.204,0,148.398,26.076,206.393,74.005L914.146,676.248
		c-78.975-95.98-96.844-230.711-43.204-344.701c5.615-11.932,3.141-26.103-6.182-35.43c-0.284-0.284-0.598-0.581-0.917-0.877
		L777.082,208.482z M269.104,857.499c0-26.971,21.944-48.915,48.915-48.915s48.915,21.944,48.915,48.915
		c0,26.975-21.944,48.92-48.915,48.92S269.104,884.474,269.104,857.499z M837.079,1428.811c95.366,0,174.466,61.813,193.24,145.686
		H643.844C662.612,1490.623,741.713,1428.811,837.079,1428.811z M1272.743,1731.402H401.418v-94.361h207.048h457.23h207.047
		V1731.402z"/>
                {
                    (menuPinned || showMenu) && (
                        <>
                            <path className="fill-primary-color dark:fill-dark-primary-color" d="M1425.366,673.413c-12.207-12.207-32.01-12.211-44.226,0.004c-12.211,12.211-12.211,32.014,0.004,44.225
		l56.703,56.699c6.104,6.104,14.109,9.157,22.11,9.157c8.002,0,16.007-3.054,22.115-9.162c12.211-12.211,12.211-32.014-0.005-44.225
		L1425.366,673.413z"/>
                            <path  className="fill-primary-color dark:fill-dark-primary-color" d="M1233.095,744.966c-17.268,0-31.272,14-31.272,31.268l-0.009,80.196c0,17.272,13.996,31.277,31.269,31.277
		h0.004c17.268,0,31.272-14,31.272-31.268l0.009-80.196c0-17.272-13.996-31.277-31.268-31.277H1233.095z"/>
                            <path className="fill-primary-color dark:fill-dark-primary-color" d="M1564.171,494.09l-80.191-0.009h-0.004c-17.269,0-31.272,14-31.272,31.269
		c0,17.271,13.995,31.276,31.268,31.276l80.192,0.009c0.004,0,0.004,0,0.004,0c17.268,0,31.272-14,31.272-31.268
		C1595.439,508.095,1581.443,494.09,1564.171,494.09z"/>
                        </>
                    )
                }

            </g>
        </svg>
    );
}

export default LampLogo;