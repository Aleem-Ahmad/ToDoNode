const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


//ya to simple Fetch API ha
export const getTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};


//ya bhi simple hi ha ma na dairy ma yahi note kar rakha ha  
export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create task');
  }
  return data;
};


// hn ya bhi youtibe par dekh rakha ha
export const toggleTaskStatus = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
    method: 'PATCH'
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return response.json();
};
