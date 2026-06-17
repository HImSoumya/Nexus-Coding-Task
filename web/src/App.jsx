import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

function App() {
const [todos, setTodos] = useState([]);
const [title, setTitle] = useState("");
const [loading, setLoading] = useState(false);

const fetchTodos = async () => {
try {
setLoading(true);


  const { data } = await axios.get(API_URL);

  setTodos(data.data);
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}


};

const addTodo = async (e) => {
e.preventDefault();


if (!title.trim()) return;

try {
  await axios.post(API_URL, { title });

  setTitle("");
  await fetchTodos();
} catch (error) {
  console.error(error);
}


};

const toggleTodo = async (todo) => {
try {
await axios.put(`${API_URL}/${todo._id}`, {
title: todo.title,
completed: !todo.completed,
});


  await fetchTodos();
} catch (error) {
  console.error(error);
}
 

};

const deleteTodo = async (id) => {
try {
await axios.delete(`${API_URL}/${id}`);

 
  await fetchTodos();
} catch (error) {
  console.error(error);
}
 

};

useEffect(() => {
  const loadTodos = async () => {
    await fetchTodos();
  };

  void loadTodos();
}, []);

return ( <div className="min-h-screen bg-gray-100 p-6"> <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6"> <h1 className="text-3xl font-bold text-center mb-6">
Todo App </h1>

 
    <form
      onSubmit={addTodo}
      className="flex gap-3 mb-6"
    >
      <input
        type="text"
        placeholder="Enter todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border rounded-lg px-4 py-2 outline-none"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Add
      </button>
    </form>

    {loading ? (
      <p className="text-center">Loading...</p>
    ) : todos.length === 0 ? (
      <p className="text-center text-gray-500">
        No Todos Found
      </p>
    ) : (
      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between border p-3 rounded-lg"
          >
            <span
              onClick={() => toggleTodo(todo)}
              className={`cursor-pointer ${
                todo.completed
                  ? "line-through text-gray-500"
                  : ""
              }`}
            >
              {todo.title}
            </span>

            <button
              onClick={() => deleteTodo(todo._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
 

);
}

export default App;
