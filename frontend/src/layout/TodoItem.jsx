import { useEffect, useState } from 'react';
import useUpdateData from '../hooks/useUpdateData';

function TodoItem({user, data}) {
    const [itemId, setItemId] = useState();
    const [projectId, setProjectId] = useState();
    const {data: complete, response, setData, handleSubmit} = useUpdateData(`/project_api/${projectId}/todo_item_complete/${itemId}/${user}/`);
    const [todoClass, setTodoClass] = useState("todo-popup-listitem");
    const [buttonClass, setButtonClass] = useState("todo-list-button");


    useEffect(() => {
        setData(true);
        setItemId(data.id)
        setProjectId(data.project_uid)
    },[]);

    const handleComplete =  async (e) => {
        e.preventDefault();
        handleSubmit(e);
        setTodoClass("todo-completed");
        setButtonClass("todo-list-button-complete");
    }

    return (
        <>
            <div className={todoClass}>
                <p>{data.date} - {data.author_uid}</p>
                <p>{data.content}</p>
                <p><button className={buttonClass} onClick={handleComplete}>Utført</button></p>
            </div>
        </>
    );
}

export default TodoItem;