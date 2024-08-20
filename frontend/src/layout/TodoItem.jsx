import { useEffect, useState } from 'react';
import useUpdateData from '../hooks/useUpdateData';

function TodoItem({ user, itemData }) {
    const [projectId, setProjectId] = useState();
    const { data, response, setData, handleSubmit } = useUpdateData(`/project_api/${projectId}/todo_item_complete/`);
    const [todoClass, setTodoClass] = useState("todo-popup-listitem");
    const [buttonClass, setButtonClass] = useState("todo-list-button");


    useEffect(() => {
        setProjectId(itemData.project_uid);

        const updatedData = {
            ["item_id"]: itemData.id,
            ["completed"]: true,
            ["completed_by"]: user,
        }
        setData(updatedData);

    }, []);

    const handleComplete = async (e) => {
        console.log(data)
        await handleSubmit(e);
        setTodoClass("todo-completed");
        setButtonClass("todo-list-button-complete");
    }

    return (
        <div className={todoClass}>
            <p>{itemData.date} - {itemData.author_uid}</p>
            <p>{itemData.content}</p>
            <p>
                <form>
                    <button onClick={handleComplete} className={buttonClass}>Utført</button>
                </form>
            </p>
        </div>
    );
}

export default TodoItem;