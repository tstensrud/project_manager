function SelectComponent({title, id, values}) {
    
    const options = values.map(item => (<option key={item.id} value={item.id}>{item.name}</option>));
    
    return (
        <>
        <select name={title} id={id}>
            {options}
        </select>
        </>
    );
}

export default SelectComponent;