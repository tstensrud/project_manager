import { useParams } from 'react-router-dom';
import { useEffect, useContext, useRef } from 'react';

// hooks and utils
import useFetch from '../hooks/useFetch'
import useSubmitData from '../hooks/useSubmitData'
import { AuthContext } from "../context/AuthContext";
import { GlobalContext } from '../context/GlobalContext';

// components
import TodoItem from './TodoItem';
import LoadingSpinner from './LoadingSpinner';
import CardButton from './formelements/CardButton';
import CardInputField from './formelements/CardInputField';



function TodoList({ setShowTodoList, showTodoList }) {
    const { activeProject, activeProjectName } = useContext(GlobalContext);
    const { currentUser, idToken, dispatch, loading: authLoading } = useContext(AuthContext);

    // Hooks
    const { data: todo, loading, error, refetch } = useFetch(`/project_api/${activeProject}/todo/`);
    const { data: newTodo, response, setData, handleSubmit } = useSubmitData(currentUser ? `/project_api/${activeProject}/new_todo_item/${currentUser.uid}/` : null);

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
    /* <div className="flex fixed left-0 top-0 w-full z-10 h-full bg-background-shade"> */
    /*<div className="flex top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed border rounded-lg dark:border-dark-default-border-color border-default-border-color h-[500px] bg-secondary-color dark:bg-dark-secondary-color shadow-lg shadow-background-shade justify-start flex-col items-start z-[1000] w-[400px] text-xs"> */
    return (
        <div className="flex fixed left-0 top-0 w-full z-10 h-full bg-background-shade">
            <div className={`flex absolute animate-slideInFromTop left-1/2 -translate-x-1/2 rounded-lg dark:border-dark-default-border-color border-default-border-color h-[500px] overflow-y-auto bg-secondary-color dark:bg-dark-secondary-color shadow-lg shadow-background-shade justify-start flex-col items-start z-[1000] w-[400px]`}>

                <div className="flex flex-col sticky top-0 border-b items-center border-default-border-color dark:border-dark-default-border-color w-full bg-secondary-color dark:bg-dark-tertiary-color">

                    <div className="flex flex-row w-full items-center justify-center h-10">
                        <div className="w-[10%] h-full">

                        </div>
                        <div className="flex flex-1 justify-center text-md h-full items-center font-semibold tracking-wide">
                            {activeProjectName}
                        </div>
                        <div className="flex justify-center w-[10%] h-full items-start font-extrabold">
                            <div onClick={handleClick} className="text-xl cursor-pointer hover:text-accent-color hover:dark:text-dark-accent-color">&times;</div>
                        </div>
                    </div>

                    <form className="w-[90%]" onSubmit={submitTodoItem}>
                        <div className="w-full flex justify-between pb-2">
                            <div className="bg-tertiary-color dark:bg-dark-tertiary-color">
                                <CardInputField ref={inputRef} name="todo_content" placeholder="Nytt huskepunkt" changeFunction={handleInputChange} required={true} />
                            </div>
                            <div className="flex border-b-default-border-color">
                                <CardButton buttonText="Legg til" disabled={false} />
                            </div>
                        </div>
                    </form>

                </div>

                <div className="flex flex-col items-center justify-center w-full pt-3 pb-3">
                    {
                        loading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {
                                    !todo?.todo ? (
                                        <div className="bg-tertiary-color w-full dark:bg-dark-tertiary-color text-sm text-center text-primary-color dark:text-dark-primary-color p-2 relative border-b border-form-border-color dark:border-dark-default-border-color">
                                            Ingen huskepunkter
                                        </div>
                                    ) : (
                                        todo?.todo && Object.keys(todo.todo).map((key, index) => {
                                            return (<TodoItem key={index} user={currentUser.uid} itemData={todo.todo[key]} refetch={refetch} />);
                                        })
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