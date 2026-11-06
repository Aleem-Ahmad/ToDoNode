import { createContext, useContext, useState, useCallback } from 'react';

const FlashContext = createContext(null);

export function FlashProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const removeFlash = useCallback((id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const showFlash = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newMsg = { id, message, type, duration };

    setMessages((prev) => [...prev, newMsg]);

    if (duration > 0) {
      setTimeout(() => {
        removeFlash(id);
      }, duration);
    }
  }, [removeFlash]);

  const flashSuccess = useCallback((msg, duration) => showFlash(msg, 'success', duration), [showFlash]);
  const flashError = useCallback((msg, duration) => showFlash(msg, 'error', duration), [showFlash]);
  const flashWarning = useCallback((msg, duration) => showFlash(msg, 'warning', duration), [showFlash]);
  const flashInfo = useCallback((msg, duration) => showFlash(msg, 'info', duration), [showFlash]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      case 'info':
      default:
        return 'i';
    }
  };

  return (
    <FlashContext.Provider
      value={{
        showFlash,
        flashSuccess,
        flashError,
        flashWarning,
        flashInfo,
        removeFlash
      }}
    >
      {children}

      {/* Floating Flash Message Container */}
      <div className="flash-container" aria-live="polite">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`flash-item flash-${item.type}`}
            role="alert"
          >
            <div className="flash-icon">{getIcon(item.type)}</div>
            <div className="flash-message">{item.message}</div>
            <button
              onClick={() => removeFlash(item.id)}
              className="flash-close-btn"
              aria-label="Dismiss message"
            >
              ✕
            </button>
            {item.duration > 0 && (
              <div
                className="flash-progress"
                style={{ animationDuration: `${item.duration}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
}

