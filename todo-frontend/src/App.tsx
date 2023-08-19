import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

interface Todo {
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [finishedTasks, setFinishedTasks] = useState<number>(0)
  const [unfinishedTasks, setUnfinishedTasks] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckboxChange = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
    updateTodoCount(updatedTodos);
    updateTodo(index, updatedTodos[index])
  };

  const updateTodoCount = (updatedTodos: Todo[]) => {
    const completedTodos = updatedTodos.filter((todo) => todo.completed);
    setFinishedTasks(completedTodos.length);
    setUnfinishedTasks(updatedTodos.length - completedTodos.length)
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const finishedTodos = todos.filter((todo) => todo.completed);
    const unfinishedTodos = todos.filter((todo) => !todo.completed);
  
    setFinishedTasks(finishedTodos.length);
    setUnfinishedTasks(unfinishedTodos.length);
  }, [todos]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/todos/');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createTodo = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/todos/', { title: newTodoTitle });
      setTodos([...todos, response.data]);
      setNewTodoTitle('');
      inputRef.current?.focus()
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const deleteTodo = async (itemIndex: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/todos/${itemIndex}`);
      const updatedTodos = todos.filter((_, index) => index !== itemIndex);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (itemIndex: number,updatedTodo: Todo) => {
    try {
      await axios.put(`http://127.0.0.1:8000/todos/${itemIndex}`, updatedTodo);
      fetchTodos()
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div>Completed task: {finishedTasks}</div>
      <div>Unfinished task: {unfinishedTasks}</div>
      <div>
        <input
          ref={inputRef}
          type="text"
          placeholder="New Todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button onClick={createTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} className='todo-item'>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {handleCheckboxChange(index)}}
              />
              {todo.title}
            </div>
            <span className='delete-btn' onClick={() => deleteTodo(index)}>&times;</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
