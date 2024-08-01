import { useParams } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

import useFetch from '../hooks/useFetch'
import useSubmitData from '../hooks/useSubmitData'
import TodoItem from './TodoItem';
import LoadingSpinner from './LoadingSpinner';



function TodoList({ setShowTodoList }) {
    const { projectId } = useParams();
    const { userUuid, activeProject } = useContext(GlobalContext);

    // Hooks
    const { data: todo, loading, error, refetch } = useFetch(`/project_api/${projectId}/todo/`);
    const { data: newTodo, setData, handleSubmit } = useSubmitData(`/project_api/${projectId}/new_todo_item/${userUuid}/`);


    const handleClick = (e) => {
        setShowTodoList(false);
    }

    const handleInputChange = (e) => {
        setData({
            ...newTodo,
            [e.target.name]: e.target.value,
        });
    }

    const submitTodoItem = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        refetch();
    }

    return (
        <>
            <div id="todo-popup" className="todo-popup">
                <div className="todo-popup-header">
                    <span onClick={(e) => handleClick(e, setShowTodoList)} className="todo-close-btn">&times;</span>
                    <br />
                    Huskeliste
                </div>
                <div className="todo-popup-item-container" id="todo-popup-item-container">
                    <form id="todoItem" onSubmit={submitTodoItem}>
                        <div className="todo-popup-listitem-form ">
                            <input name="todo_content" type="text" className="todo-input" placeholder="Nytt huskepunkt" onChange={handleInputChange} />
                        </div>
                        <div className="todo-popup-listitem">
                            <button className="todo-list-button">Legg til</button>
                        </div>
                    </form>
                    {
                        loading && loading === true ? (
                            <>
                                <LoadingSpinner />
                            </>
                        ) : (
                            <>
                                {
                                    todo && todo.todo === null ? (
                                        <>
                                            <div className="todo-popup-listitem">Ingen huskepunkter</div></>
                                    ) : (
                                        todo && todo.todo && Object.keys(todo.todo).map((key, index) => (
                                            <TodoItem key={index} user={userUuid} itemData={todo.todo[key]} />))
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default TodoList;