import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import EditorPage from './pages/EditorPage/EditorPage';
import { useProjectStore } from './store/projectStore';
import { useUIStore } from './store/uiStore';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function App() {
  const { initProjects } = useProjectStore();
  const { toasts } = useUIStore();

  useEffect(() => {
    initProjects();
  }, [initProjects]);

  return (
    <>
      <ErrorBoundary fallbackLabel="页面">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:projectId" element={<EditorPage />} />
        </Routes>
      </ErrorBoundary>
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'error' ? '#EF4444' : t.type === 'success' ? '#10B981' : '#3B82F6',
            color: 'white', padding: '10px 16px', borderRadius: 8, fontSize: 13,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease'
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
