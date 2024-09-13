import { useEffect, useState } from 'react';

// Hooks
import useUpdateData from '../hooks/useUpdateData';

// Components
import CardButton from './formelements/CardButton';

function TodoItem({ user, itemData }) {
    const [projectId, setProjectId] = useState();
    const { data, response, setData, handleSubmit } = useUpdateData(`/project_api/${projectId}/todo_item_complete/`);
    const [todoClass, setTodoClass] = useState("todo-popup-listitem");
    const [completed, setCompleted] = useState(false);


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
            setTodoClass("line-through bg-secondary-color text-primary-color w-full border-b border-form-border-color p-2");
            setCompleted(true);
        }
    }, [response]);

    const handleComplete = async (e) => {
        await handleSubmit(e);
    }

    return (
        <div className="border-b border-t border-form-border-color dark:border-dark-form-border-color">
            <div className="w-full text-base font-semibold pl-2">{itemData.date} - {itemData.author_uid}</div>
            <div className={completed ? "line-through bg-secondary-color dark:bg-dark-secondary-color text-base text-primary-color dark:text-dark-primary-color w-full border-form-border-color dark:border-dark-form-border-color p-2" : "w-full text-base pl-2"}>
                {itemData.content}
            </div>
            <div className="pl-2 pb-2 pt-2">
                {
                    !completed &&
                    (
                        <form>
                            <CardButton clickFunction={handleComplete} buttonText="Utført" />
                        </form>
                    )
                }
            </div>
        </div>
    );
}

export default TodoItem;