import { useState } from 'react';
import TodoList from './TodoList';

function ToDo() {

    const [showTodoList, setShowTodoList] = useState(false);


    const handleClick = (e) => {
        e.preventDefault();
        setShowTodoList(!showTodoList);
    }

    return (
        <>
            <div onClick={(e) => handleClick(e, setShowTodoList)} className="flex flex-row items-center text-grey-text dark:text-dark-grey-text cursor-pointer">
                <div className="group relative cursor-pointer group border hover:bg-accent-color hover:border-accent-color hover:dark:bg-dark-navbar-active-bg-color dark:border-dark-accent-color rounded-lg transition duration-200 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-color group-hover:stroke-secondary-color group-hover:dark:stroke-dark-primary-color dark:stroke-dark-grey-text fill-none transition duration-200">
                        <polyline points="22 13 16 13 14 16 10 16 8 13 2 13"></polyline>
                        <path d="M5.47 5.19L2 13v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5l-3.47-7.81A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.83 1.19z"></path>
                    </svg>
                </div>
            </div>
            {
                showTodoList && <TodoList showTodoList={showTodoList} setShowTodoList={setShowTodoList} />
            }
        </>
    );
}

export default ToDo;