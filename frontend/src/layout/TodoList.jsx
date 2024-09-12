import { useParams } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

import useFetch from '../hooks/useFetch'
import useSubmitData from '../hooks/useSubmitData'
import TodoItem from './TodoItem';
import LoadingSpinner from './LoadingSpinner';
import CardButton from './formelements/CardButton';



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
        <div id="todo-popup" className="flex fixed top-0 right-0 h-full bg-secondary-color shadow shadow-background-shade justify-start flex-col items-start z-[1000] w-[300px] text-xs">
            
            <div className="flex flex-col border-b-default-border-color p-1 relative font-extrabold w-full">
                <div className="flex justify-end w-full">
                    <span onClick={(e) => handleClick(e, setShowTodoList)} className="text-xl cursor-pointer hover:text-accent-color">&times;</span>
                </div>
                <div className="w-full">
                    <h4>Huskeliste</h4>
                </div>
            </div>

            <div className="overflow-y-auto w-full">
                <form id="todoItem" onSubmit={submitTodoItem}>
                    <div className="bg-tertiary-color text-primary-color p-2 relative h-12 border-b border-t border-form-border-color w-full">
                        <input name="todo_content" type="text" className="text-primary-color pl-3 text-xs rounded-none w-full h-full box-border transition duration-100 m-0 border-none top-0 left-0 absolute" placeholder="Nytt huskepunkt" onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col border-b-default-border-color p-1 relative font-extrabold">
                        <CardButton buttonText="Legg til punkt" />
                    </div>
                </form>
                {
                    loading && loading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {
                                todo && todo.todo === null ? (
                                    <div className="bg-tertiary-color text-primary-color p-2 relative w-[300px] border-b border-b-form-border-color">
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