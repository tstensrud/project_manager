import { useEffect, useState } from "react";

// hooks
import useDeleteData from '../../../hooks/useDeleteData';

// components
import LoadingSpinner from "../../../layout/LoadingSpinner";

function ProjectTableRow(props) {
    const { data: deleteData, setData: setDeleteData, response: deleteResponse, handleSubmit: handleDelete, loading: deleteLoading } = useDeleteData(`/projects/delete_project/`);

    useEffect(() => {
        if (deleteResponse?.success === true) {
            props.refetch();
        } else if (deleteResponse?.success === false) {
            console.log(deleteResponse.message)
        }
    }, [deleteResponse]);

    useEffect(() => {
        setDeleteData({ project_uid: props.data.uid });
    }, []);

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        if (deleteData) {
            await handleDelete();
        }
    }

    return (
        <tr className="hover:bg-table-hover dark:hover:bg-dark-table-hover">
            <td className="pt-1 pb-1 pl-3 min-w-[10%] max-w-[10%] w-[10%] text-start">
                {props.data.id}
            </td>
            <td className="pt-1 pb-1 min-w-[20%] max-w-[20%] w-[20%]">
                {props.data.uid}
            </td>
            <td className="pt-1 pb-1 pr-3 min-w-[15%] max-w-[15%] w-[15%]">
                {props.data.ProjectNumber}
            </td>
            <td className="pt-1 pb-1 pr-3 min-w-[30%] max-w-[30%] w-[30%]">
                {props.data.ProjectName}
            </td>
            <td className="pt-1 pb-1 pr-3 min-w-[10%] max-w-[10%] w-[10%]">
                {props.data.CreatedAt}
            </td>
            <td className="pt-1 pb-1 pr-3 min-w-[10%] max-w-[10%] w-[10%]">
                <div className="flex flex-row">
                    <div className="">
                        <button onClick={handleDeleteClick} className="font-semibold hover:text-accent-color dark:hover:text-dark-accent-color">
                            Slett
                        </button>
                    </div>
                    <div className="flex flex-1 text-end">
                        {
                            deleteLoading && <LoadingSpinner />
                        }
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default ProjectTableRow;