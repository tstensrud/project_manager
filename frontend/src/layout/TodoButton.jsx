import { useState } from 'react';
import TodoListIcon from '../assets/svg/todoListIcon.svg?react';
import TodoList from './TodoList';

function ToDo() {

    const [infoText, setInfoText] = useState(false);

    const [showTodoList, setShowTodoList] = useState(false);
    const handleClick = (e) => {
        e.preventDefault();
        setShowTodoList(!showTodoList);
    }

    const handleMouseOver = () => {
        setInfoText(true)
    }

    const handleMouseOut = () => {
        setInfoText(false)
    }
    return (
        
        <div style={{display: "flex", alignItems: "center"}}>
            <div style={{marginRight: "10px"}}>
            {
            infoText ? "Huskeliste" : ""
            }
            </div>
        
            <a onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className="todo-link" href="#" onClick={(e) => handleClick(e, setShowTodoList)}>
                {TodoListIcon && <TodoListIcon />}
            </a>
            {showTodoList && <TodoList showTodoList={showTodoList} setShowTodoList={setShowTodoList} />}
            </div>
        
    );
}

export default ToDo;