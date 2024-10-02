import { useParams } from 'react-router-dom';
import { useEffect, useContext, useRef } from 'react';

// hooks and utils
import useFetch from '../hooks/useFetch'
import useSubmitData from '../hooks/useSubmitData'
import { AuthContext } from "../context/AuthContext";

// components
import TodoItem from './TodoItem';
import LoadingSpinner from './LoadingSpinner';
import CardButton from './formelements/CardButton';



function TodoList({ setShowTodoList, showTodoList }) {
    const { projectId } = useParams();
    const { currentUser, idToken, dispatch, loading: authLoading } = useContext(AuthContext);

    // Hooks
    const { data: todo, loading, error, refetch } = useFetch(`/project_api/${projectId}/todo/`);
    const { data: newTodo, response, setData, handleSubmit } = useSubmitData(`/project_api/${projectId}/new_todo_item/${currentUser.uid}/`);

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
        setShowTodoList(!showTodoList);
    }

    const handleInputChange = (e) => {
        setData({
            ...newTodo,
            [e.target.name]: e.target.value,
        });
    }

    const submitTodoItem = async (e) => {
        e.preventDefault();
        if (!newTodo) {
            return;
        }
        await handleSubmit();
    }

    return (
        <div className="flex fixed left-0 top-0 w-full z-10 h-full bg-background-shade">
            <div className="flex top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed border rounded-lg dark:border-dark-form-border-color border-default-border-color h-[500px] bg-secondary-color dark:bg-dark-secondary-color shadow-lg shadow-background-shade justify-start flex-col items-start z-[1000] w-[400px] text-xs">
                <div className="flex flex-col sticky border-b items-center border-default-border-color dark:border-dark-default-border-color w-full">
                    
                    <div className="flex flex-row w-full items-center justify-center h-10">
                        <div className="w-[10%] h-full">

                        </div>
                        <div className="flex flex-1 justify-center text-xl h-full items-center font-semibold tracking-wide">
                            Huskeliste
                        </div>
                        <div className="flex justify-center w-[10%] h-full items-start font-extrabold">
                            <div onClick={handleClick} className="text-xl cursor-pointer hover:text-accent-color hover:dark:text-dark-accent-color">&times;</div>
                        </div>
                    </div>

                    <div className="w-full">
                        <form id="todoItem" onSubmit={submitTodoItem}>
                            <div className="bg-tertiary-color dark:bg-dark-tertiary-color p-2 relative h-12 w-full">
                                <input ref={inputRef} name="todo_content" type="text" className="bg-tertiary-color border-form-border-color dark:border-dark-default-border-color dark:bg-dark-form-background-color text-primary-color dark:text-dark-primary-color pl-3 text-base rounded-none w-full h-full m-0 border-t border-b top-0 left-0 right-0 absolute focus:outline-none" placeholder="Nytt huskepunkt" onChange={handleInputChange} required />
                            </div>
                            <div className="flex flex-col border-b-default-border-color p-1 mt-2 mb-2 relative">
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
                                            <TodoItem key={index} user={currentUser.uid} itemData={todo.todo[key]} />
                                        ))
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default TodoList;