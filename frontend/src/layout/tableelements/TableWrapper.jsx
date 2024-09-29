import { useEffect, useRef, useState } from "react";

import FloorTitleBar from "./FloorTitleBar";

function TableWrapper({floor, children, collapseAll}) {

    const [showTable, setShowTable] = useState(false);
    const tableRef = useRef(null);
    const [tableHeight, setTableHeight] = useState(0);

    useEffect(() => {
        if (tableRef.current) {
            setTableHeight(tableRef.current.scrollHeight);
        }
    },[]);
    
    useEffect(() => {
        if (collapseAll) {
            setShowTable(false);
        } else {
            setShowTable(true);
        }
    },[collapseAll]);

    useEffect(() => {
        if (tableRef.current) {
            if (showTable) {
                setTableHeight(tableRef.current.scrollHeight);
            } else {
                setTableHeight(0);
            }
        }
    },[showTable]);

    return (
        <div className="pb-3">
            {
                floor && <FloorTitleBar setShowTable={setShowTable} showTable={showTable} floor={floor} />
            }
            <div style={{maxHeight: `${tableHeight}px`}} className={showTable ?
                `flex overflow-y-auto flex-col transition-all duration-700 ease-in-out mt-0 bg-secondary-color dark:bg-dark-secondary-color shadow-lg shadow-background-shade dark:shadow-none` :
                "max-h-0 overflow-hidden transition-all duration-700 ease-in-out"}>
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