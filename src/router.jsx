import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import App from './App';
import HomePage from './routes/index';
import AboutPage from './routes/about';
import AudioPage from './routes/audio';
import VisualPage from './routes/visual';

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomePage,
});

const audioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio',
  component: AudioPage,
});

const visualRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visual',
  component: VisualPage,
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, homeRoute, audioRoute, visualRoute]);

export const router = createRouter({ routeTree });
