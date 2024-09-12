import { useState } from 'react';
import TodoListIcon from '../assets/svg/todoListIcon.jsx';
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
        
        <div className="flex items-center">
            <div className="mr-3">
            {
            infoText ? "Huskeliste" : ""
            }
            </div>
        
            <a onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}  href="#" onClick={(e) => handleClick(e, setShowTodoList)}>
                {TodoListIcon && <TodoListIcon />}
            </a>
            {showTodoList && <TodoList showTodoList={showTodoList} setShowTodoList={setShowTodoList} />}
            </div>
        
    );
}

export default ToDo;