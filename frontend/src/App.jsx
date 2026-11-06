import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import TaskList from './components/TaskList.jsx';
import AddTask from './components/AddTask.jsx';
import './App.css';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<TaskList />} />
          <Route path="/add-task" element={<AddTask />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
