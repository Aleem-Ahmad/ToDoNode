import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, toggleTaskStatus, deleteTask } from '../services/api';
import { useFlash } from '../context/FlashContext';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null); // for custom delete modal

  const { flashSuccess, flashError, flashInfo } = useFlash();

  const fetchTasks = async (isManualRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTasks();
      setTasks(res.data || []);
      if (isManualRefresh) {
        flashInfo('Task list refreshed');
      }
    } catch (err) {
      const msg = err.message || 'Could not connect to backend server';
      setError(msg);
      flashError(`Backend connection failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (id) => {
    try {
      const res = await toggleTaskStatus(id);
      const isCompleted = res.data.completed;
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );

      if (isCompleted) {
        flashSuccess('Task completed! Keep up the good work! 🎉');
      } else {
        flashInfo('Task moved back to pending');
      }
    } catch (err) {
      flashError('Error updating task: ' + err.message);
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete._id);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      flashSuccess(`"${taskToDelete.title}" was deleted successfully`);
    } catch (err) {
      flashError('Error deleting task: ' + err.message);
    } finally {
      setTaskToDelete(null);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>Task List</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Live MongoDB Atlas Tasks
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => fetchTasks(true)}
            style={refreshBtnStyle}
            title="Refresh tasks"
          >
            ↻ Refresh
          </button>
          <Link to="/add-task" style={addButtonPrimary}>
            + New Task
          </Link>
        </div>
      </div>

      {loading && (
        <div style={statusCardStyle}>
          <p style={{ color: '#475569', margin: 0 }}>Loading tasks from server...</p>
        </div>
      )}

      {error && (
        <div style={{ ...statusCardStyle, borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
          <p style={{ color: '#b91c1c', margin: '0 0 8px', fontWeight: '500' }}>⚠️ {error}</p>
          <small style={{ color: '#7f1d1d' }}>
            Ensure your backend is running on <code>http://localhost:5000</code>.
          </small>
          <div style={{ marginTop: '14px' }}>
            <button onClick={() => fetchTasks(true)} style={retryBtnStyle}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div style={statusCardStyle}>
          <p style={{ color: '#475569', fontSize: '16px', margin: '0 0 16px' }}>No tasks found!</p>
          <Link to="/add-task" style={addButtonPrimary}>
            Create your first task
          </Link>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                ...taskCardStyle,
                borderLeft: task.completed ? '4px solid #10b981' : '4px solid #3b82f6',
                opacity: task.completed ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task._id)}
                  style={{ marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <div>
                  <h3
                    style={{
                      margin: '0 0 4px',
                      fontSize: '16px',
                      color: task.completed ? '#64748b' : '#0f172a',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '14px' }}>
                      {task.description}
                    </p>
                  )}
                  <span style={getPriorityBadgeStyle(task.priority)}>
                    {task.priority || 'medium'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setTaskToDelete(task)}
                style={deleteBtnStyle}
                title="Delete task"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal Popup for Deletion */}
      {taskToDelete && (
        <div className="modal-overlay" onClick={() => setTaskToDelete(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🗑️
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Delete Task?</h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 20px', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>"{taskToDelete.title}"</strong>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setTaskToDelete(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Yes, Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  maxWidth: '700px',
  margin: '30px auto',
  padding: '0 20px',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const addButtonPrimary = {
  backgroundColor: '#3b82f6',
  color: 'white',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  fontWeight: '500',
  fontSize: '14px',
  display: 'inline-flex',
  alignItems: 'center'
};

const refreshBtnStyle = {
  backgroundColor: '#f1f5f9',
  color: '#334155',
  border: '1px solid #cbd5e1',
  padding: '8px 14px',
  borderRadius: '6px',
  fontWeight: '500',
  fontSize: '13px',
  cursor: 'pointer'
};

const retryBtnStyle = {
  padding: '8px 16px',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500'
};

const taskCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
  transition: 'all 0.2s'
};

const deleteBtnStyle = {
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500'
};

const statusCardStyle = {
  textAlign: 'center',
  padding: '30px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px dashed #cbd5e1'
};

const getPriorityBadgeStyle = (priority) => {
  const base = {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '12px'
  };

  switch (priority) {
    case 'high':
      return { ...base, backgroundColor: '#fee2e2', color: '#b91c1c' };
    case 'low':
      return { ...base, backgroundColor: '#dcfce7', color: '#15803d' };
    default:
      return { ...base, backgroundColor: '#fef3c7', color: '#b45309' };
  }
};
