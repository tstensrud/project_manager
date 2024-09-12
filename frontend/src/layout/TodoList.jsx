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
        <div id="todo-popup" className="todo-popup">
            <div className="flex flex-col border-b-default-border-color p-1 relative font-extrabold">
                <div className="flex justify-end w-full">
                    <span onClick={(e) => handleClick(e, setShowTodoList)} className="todo-close-btn">&times;</span>
                </div>
                <div>
                    Huskeliste
                </div>
            </div>
            <div className="todo-popup-item-container">
                <form id="todoItem" onSubmit={submitTodoItem}>
                    <div className="todo-popup-listitem-form ">
                        <input name="todo_content" type="text" className="todo-input" placeholder="Nytt huskepunkt" onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col border-b-default-border-color p-1 relative font-extrabold">
                        <button className="todo-list-button">Legg til</button>
                    </div>
                </form>
                {
                    loading && loading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {
                                todo && todo.todo === null ? (
                                    <div className="todo-popup-listitem">
                                        Ingen huskepunkter
                                    </div>
                                ) : (
                                    todo && todo.todo && Object.keys(todo.todo).map((key, index) => (
                                        <TodoItem key={index} user={userUuid} itemData={todo.todo[key]} />
                                    ))
                                )
                            }
                        </>
                    )
                }
                
            </div>
        </div>
    );
}

export default TodoList;