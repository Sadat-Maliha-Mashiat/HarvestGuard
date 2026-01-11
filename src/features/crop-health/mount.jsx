import React from 'react';
import ReactDOM from 'react-dom/client';
import PestUploader from '../../components/PestUploader';
// Import global styles if needed, or rely on component css
// import '../../shared/css/main.css'; 

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <div style={{ padding: '0', background: 'transparent', minHeight: '100vh' }}>
                <PestUploader />
            </div>
        </React.StrictMode>
    );
}
