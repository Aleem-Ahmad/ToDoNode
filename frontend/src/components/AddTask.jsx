import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from '../services/api';
import { useFlash } from '../context/FlashContext';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { flashSuccess, flashError, flashWarning } = useFlash();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      flashWarning('Task title cannot be empty!');
      return;
    }

    try {
      setLoading(true);
      await createTask({
        title: title.trim(),
        description: description.trim(),
        priority
      });

      flashSuccess('Task created successfully! 🎉');
      navigate('/list');
    } catch (err) {
      flashError(err.message || 'Failed to create task');
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ margin: '0 0 8px', fontSize: '24px', color: '#1e293b' }}>Add New Task</h1>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px' }}>
          Fill in details below to store your new task in MongoDB Atlas.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Design Landing Page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Description (Optional)</label>
            <textarea
              placeholder="Add details, notes or steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
              style={inputStyle}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryBtnStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Task...' : 'Save Task'}
            </button>

            <Link to="/list" style={cancelBtnStyle}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const containerStyle = {
  maxWidth: '600px',
  margin: '30px auto',
  padding: '0 20px',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '28px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
};

const formGroupStyle = {
  marginBottom: '18px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#334155'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '15px',
  boxSizing: 'border-box',
  outline: 'none'
};

const primaryBtnStyle = {
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  fontSize: '15px',
  fontWeight: '500',
  flex: 1
};

const cancelBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  textDecoration: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  fontSize: '15px',
  fontWeight: '500'
};
