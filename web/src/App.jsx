import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      setLoading(true)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 antialiased selection:bg-indigo-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 transition-all">
        {/* Header */}
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">Keep track of your daily workflow</p>
        </header>

        {/* Form Container */}
        <form onSubmit={addTodo} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-3 rounded-xl font-medium shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </form>

        {/* Todo List Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">Fetching your tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 mx-auto mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24a4.5 4.5 0 1 1 15.75m-12.75 0h4.51m-1.353 3.596c-.115.08-.223.171-.321.273L8.414 10.58a2.25 2.25 0 0 0-.659 1.591v2.584c0 .597.237 1.17.659 1.591l1.592 1.592a2.25 2.25 0 0 0 1.591.659h2.584c.597 0 1.17-.237 1.591-.659l1.592-1.592a2.25 2.25 0 0 0 .659-1.591v-2.584c0-.597-.237-1.17-.659-1.591l-1.592-1.592a2.25 2.25 0 0 0-1.591-.659h-2.584a2.25 2.25 0 0 0-1.591.659Z" />
            </svg>
            <p className="text-sm font-medium text-slate-500">All caught up!</p>
            <p className="text-xs text-slate-400 mt-1">Add a task above to get started.</p>
          </div>
        ) : (
          <ul className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`group flex items-center justify-between border p-3.5 rounded-xl transition-all duration-200 ${
                  todo.completed
                    ? "bg-slate-50/70 border-slate-100"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div 
                  onClick={() => toggleTodo(todo)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 selective-none"
                >
                  {/* Custom Checkbox Design */}
                  <div className={`w-5 h-5 flex items-center justify-center rounded-md border transition-all ${
                    todo.completed 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : "border-slate-300 bg-white group-hover:border-indigo-500"
                  }`}>
                    {todo.completed && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Text */}
                  <span className={`text-sm sm:text-base font-medium truncate transition-all ${
                    todo.completed
                      ? "line-through text-slate-400"
                      : "text-slate-700"
                  }`}>
                    {todo.title}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete Task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
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