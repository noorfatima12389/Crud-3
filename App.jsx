import { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import './app.css';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);

  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.find(i => i.id === id);
    if (t) {
      setTodo(t.todo);
      let newTodos = todos.filter(item => item.id !== id);
      setTodos(newTodos);
      saveToLS(newTodos);
    }
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleAdd = () => {
    if (todo.trim().length <= 3) return;
    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => item.id === id);
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredTodos = todos.filter(item =>
    item.todo.toLowerCase().includes(search) &&
    (showFinished || !item.isCompleted)
  );

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <span>CRUD APPLICATION</span>
          </div>
          <ul className="nav-links">
            <li>Home</li>
            <li>Your Tasks</li>
          </ul>
        </div>
      </nav>

      <div className="app-wrapper">
        <div className="container">
          <h1 className='heading'>CRUD APPLICATION</h1>
          <p className="subtext">Manage your todos in one place</p>

          <div className="add-todo">
            <h2>Add a Todo</h2>
            <div className="input-group">
              <input
                onChange={handleChange}
                value={todo}
                type="text"
                placeholder="Write your todo..."
              />
              <button onClick={handleAdd} disabled={todo.trim().length <= 3}>
                Save
              </button>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="🔍 Search todos..."
            />
          </div>

          <div className="toggle-finished">
            <input
              id='show'
              onChange={toggleFinished}
              type="checkbox"
              checked={showFinished}
            />
            <label htmlFor="show">Show Finished</label>
          </div>

          <h2 className="list-heading">Your Todos</h2>
          <div className="todo-list">
            {filteredTodos.length === 0 ? (
              <div className='no-todos'>No Todos to display</div>
            ) : (
              filteredTodos.map(item => (
                <div key={item.id} className="todo-item">
                  <div className='todo-left'>
                    <input
                      name={item.id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                    />
                    <span className={item.isCompleted ? "completed" : ""}>
                      {item.todo}
                    </span>
                  </div>
                  <div className="todo-actions">
                    <button onClick={(e) => handleEdit(e, item.id)} className="edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={(e) => handleDelete(e, item.id)} className="delete-btn">
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
