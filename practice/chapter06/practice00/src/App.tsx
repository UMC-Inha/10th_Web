import { TodoList } from './pages/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-8">
        My Todo App 🚀
      </h1>
      <TodoList />
    </div>
  );
}

export default App;