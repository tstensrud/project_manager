import { useState } from 'react';
import TodoListIcon from '../assets/svg/todoListIcon.svg?react';
import Notebook from '../assets/svg/notebook.svg?react';
import TodoList from './TodoList';

function ToDo() {
    const [showTodoList, setShowTodoList] = useState(false);
    const handleClick = (e) => {
        e.preventDefault();
        setShowTodoList(!showTodoList);
    }
    return (
        <>
        <div className="todo-container">
            <a className="todo-link" href="#" onClick={(e) => handleClick(e, setShowTodoList)}>
                {TodoListIcon && <TodoListIcon />}
            </a>
        </div>
        {showTodoList && <TodoList showTodoList={showTodoList} setShowTodoList={setShowTodoList} />}
    </>
    );
}

export default ToDo;