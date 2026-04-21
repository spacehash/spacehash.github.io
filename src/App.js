import { CssBaseline } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import TopBar from './components/redesign/TopBar';
import Nav from './components/redesign/Nav';

function App() {
  return (
    <div className="app">
      <CssBaseline />
      <TopBar />
      <div className="view">
        <Outlet />
      </div>
      <div id="nav-actions" className="nav-actions" />
      <Nav />
    </div>
  );
}

export default App;
