import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { PaletteProvider } from './context/PaletteContext';
import { ThemeModeProvider } from './context/ThemeContext';
import './styles/palettes.css';
import './styles/redesign.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PaletteProvider>
      <ThemeModeProvider>
        <RouterProvider router={router} />
      </ThemeModeProvider>
    </PaletteProvider>
  </React.StrictMode>
);
