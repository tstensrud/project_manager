import { useEffect, useState } from 'react';

// Hooks
import useUpdateData from '../hooks/useUpdateData';

// Components
import CardButton from './formelements/CardButton';

function TodoItem({ user, itemData, refetch }) {
    const [projectId, setProjectId] = useState();
    const { data, response, setData, handleSubmit } = useUpdateData(`/project_api/${projectId}/todo_item_complete/`);

    useEffect(() => {
        setProjectId(itemData.project_uid);

        const updatedData = {
            ["item_id"]: itemData.id,
            ["completed"]: true,
            ["completed_by"]: user,
        }
        setData(updatedData);

    }, []);

    useEffect(() => {
        if (response?.success === true) {
            refetch();
        }
    }, [response]);

    const handleComplete = async (e) => {
        e.preventDefault();
        await handleSubmit();
    }

    return (
        <div className="flex justify-center pt-1 pb-1 w-[90%]">
            <div className="flex flex-col w-full bg-accent-color dark:bg-dark-accent-color rounded-e-xl rounded-es-xl">
                <div className="flex flex-col p-2 w-full items-center text-secondary-color dark:text-dark-primary-color">

                    <div className="flex flex-col text-xs w-full text-primary-text dark:text-dark-primary-color">
                        <div className="flex w-full">
                            <div className="dark:text-[#b0c4de] text-[#b0c4de]">
                                {itemData.date}: {itemData.author_uid}
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-sm">
                        {itemData.content}
                    </div>
                    <div className="flex w-full justify-end">
                        <form>
                            <button className="border border-secondary-color rounded-lg p-1 hover:text-primary-color hover:dark:text-dark-primary-color hover:bg-secondary-color dark:bg-dark-secondary-color hover:dark:bg-dark-tertiary-color text-xs transition duration-200" onClick={handleComplete}>Merk som utført</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodoItem;