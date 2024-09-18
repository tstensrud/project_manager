import { useParams } from 'react-router-dom';
import { useEffect, useContext, useRef } from 'react';
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
    const { data: newTodo, response, setData, handleSubmit } = useSubmitData(`/project_api/${projectId}/new_todo_item/${userUuid}/`);

    const inputRef = useRef(null);

    useEffect(() => {
        if (response?.success === true) {
            refetch();
            inputRef.current.value = '';
            setData({})
        }
    }, [response]);
    // Handlers
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
        if (!newTodo){
            return;
        }
        await handleSubmit(e);
    }
console.log(response)
    return (
        <div className="flex fixed top-0 right-0 border-l dark:border-dark-form-border-color border-default-border-color h-full bg-secondary-color dark:bg-dark-secondary-color shadow shadow-background-shade justify-start flex-col items-start z-[1000] w-[300px] text-xs">
            <div className="flex flex-col top-0 sticky border-b items-center border-default-border-color dark:border-dark-default-border-color font-extrabold w-full">
                <div className="flex flex-row w-full items-center justify-center h-10">
                    <div className="w-[10%] h-full">

                    </div>
                    <div className="flex flex-1 justify-center h-full items-center">
                        <h4>Huskeliste</h4>
                    </div>
                    <div className="flex justify-center w-[10%] h-full items-start">
                        <span onClick={(e) => handleClick(e, setShowTodoList)} className="text-xl cursor-pointer hover:text-accent-color hover:dark:text-dark-accent-color">&times;</span>
                    </div>
                </div>
                <div className="w-full">
                    <form id="todoItem" onSubmit={submitTodoItem}>
                        <div className="bg-tertiary-color dark:bg-dark-tertiary-color p-2 relative h-12 w-full">
                            <input ref={inputRef} name="todo_content" type="text" className="bg-tertiary-color border-form-border-color dark:border-dark-default-border-color dark:bg-dark-form-background-color text-primary-color dark:text-dark-primary-color pl-3 text-base rounded-none w-full h-full box-border transition duration-100 m-0 border-t border-b top-0 left-0 right-0 absolute focus:outline-none" placeholder="Nytt huskepunkt" onChange={handleInputChange} required/>
                        </div>
                        <div className="flex flex-col border-b-default-border-color p-1 mt-2 mb-2 relative font-extrabold">
                            <CardButton buttonText="Legg til punkt" />
                        </div>
                    </form>
                </div>
            </div>
            <div className="overflow-y-auto w-full">
                {
                    loading && loading === true ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {
                                todo && todo.todo === null ? (
                                    <div className="bg-tertiary-color dark:bg-dark-tertiary-color text-primary-color dark:text-dark-primary-color p-2 relative w-[300px] border-b border-form-border-color dark:border-dark-form-border-color">
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