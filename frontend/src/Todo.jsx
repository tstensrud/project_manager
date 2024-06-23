function ToDo() {
    return (
        <>
        <div id="todo-popup" className="todo-popup">
        
            <div className="todo-popup-header">
                <span className="todo-close-btn">&times;</span>
                <br />
                Huskeliste
            </div>

            <div className="todo-popup-item-container" id="todo-popup-item-container">
                
                <form id="todoItem">
                    <input type="text" id="project_id" value="{{project.id}}" hidden readonly />
                    <input type="text" id="user_id" value="{{user.id}}" hidden readonly />
                    <div className="todo-popup-listitem-form ">    
                        <input type="text" id="todo_content" className="todo-input" placeholder="Nytt huskepunkt" />
                    </div>
                    <div className="todo-popup-listitem">    
                        <button className="table-button" id="submitTodoButton">Legg til</button>
                    </div>
                

                        <div key="{{item.id}}" className="todo-popup-listitem" id="todo-popup-listitem">
                            <input type="text" className="item-id" id="item-id" value="{{item.id}}" hidden readonly />
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
        <div className="todo-container">
            <a className="todo-link" href="#" id="todo-openPopup">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> 
            </a>
        </div>
    </>
    );
}

export default ToDo;