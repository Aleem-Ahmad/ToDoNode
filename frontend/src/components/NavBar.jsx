
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            backgroundColor: '#1e293b',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
            <h2 style={{ margin: 0 }}>
                To Do App
            </h2>

            <div style={{
                display: 'flex',
                gap: '25px'
            }}>
                <Link to="/list" style={linkStyle}>
                    List
                </Link>

                <Link to="/add-task" style={linkStyle}>
                    Add Task
                </Link>
            </div>
        </nav>
    );
}

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500'
};
