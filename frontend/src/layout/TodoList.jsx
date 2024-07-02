function TodoList ({setShowTodoList}) {

    const handleClick = (e) => {
        setShowTodoList(false);
    }

    return(
        <>
            <div id="todo-popup" className="todo-popup">
                <div className="todo-popup-header">
                    <span onClick={(e) => handleClick(e, setShowTodoList)} className="todo-close-btn">&times;</span>
                    <br />
                    Huskeliste
                </div>
                <div className="todo-popup-item-container" id="todo-popup-item-container">
                    <form id="todoItem">
                        <input type="text" id="project_id" value="{{project.id}}" hidden readOnly />
                        <input type="text" id="user_id" value="{{user.id}}" hidden readOnly />
                        <div className="todo-popup-listitem-form ">
                            <input type="text" id="todo_content" className="todo-input" placeholder="Nytt huskepunkt" />
                        </div>
                        <div className="todo-popup-listitem">
                            <button className="table-button" id="submitTodoButton">Legg til</button>
                        </div>
                        <div key="{{item.id}}" className="todo-popup-listitem" id="todo-popup-listitem">
                            <input type="text" className="item-id" id="item-id" value="{{item.id}}" hidden readOnly />
                            <p>DATO - FORFATTER</p>
                            <p>Kontent</p>
                            <p><button className="todo-list-button" id="todo-completed">Utført</button></p>
                        </div>
                        <div className="todo-popup-listitem">
                            <p>Ingen huskepunkter</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default TodoList;