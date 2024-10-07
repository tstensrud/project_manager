import { useEffect, useRef, useState } from "react";

import FloorTitleBar from "./FloorTitleBar";

function TableWrapper({ floor, children, collapseAll, shaft }) {

    const [showTable, setShowTable] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);
    const tableContainerRef = useRef(null);
    const tableRef = useRef(null);

    useEffect(() => {
        if (tableRef.current) {
            if (showTable) {
                setTableHeight(tableRef.current.scrollHeight + 6);
            } else {
                setTableHeight(0);
            }
        }
    }, [children]);

    useEffect(() => {
        if (collapseAll) {
            setShowTable(false);
        } else {
            setShowTable(true);
        }
    }, [collapseAll]);

    useEffect(() => {
        if (tableRef.current) {
            if (showTable) {
                setTableHeight(tableRef.current.scrollHeight);
            } else {
                setTableHeight(0);
            }
        }
    }, [showTable]);

    return (
        <div className="pb-3">
            {
                floor ? <FloorTitleBar setShowTable={setShowTable} showTable={showTable} floor={floor} shaft={null} /> : <FloorTitleBar setShowTable={setShowTable} showTable={showTable} floor={null} shaft={shaft} />
            }
            <div ref={tableContainerRef} style={{ maxHeight: `${tableHeight}px` }}
                className={showTable ?
                    `flex flex-col overflow-y-auto transition-all duration-700 ease-in-out mt-0 bg-secondary-color dark:bg-dark-secondary-color` :
                    "max-h-0 overflow-hidden transition-all duration-700 ease-in-out"
                }
                onTransitionEnd={() => {
                    if (showTable) {
                        tableContainerRef.current.classList.remove('overflow-y-auto');
                        tableContainerRef.current.classList.add("overflow-visible");
                    }
                }}>
                <div className="flex flex-col mt-0 h-auto bg-secondary-color dark:bg-dark-secondary-color">
                    <table ref={tableRef} className="text-primary-color dark:text-dark-primary-color text-xs border-none border-collapse w-full max-w-full whitespace-nowrap">
                        {children}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TableWrapper;