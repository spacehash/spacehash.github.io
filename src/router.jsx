import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import App from './App';
import HomePage from './routes/index';
import AboutPage from './routes/about';
import RentalsPage from './routes/rentals';

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

const rentalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rentals',
  component: RentalsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, homeRoute, rentalsRoute]);

export const router = createRouter({ routeTree });
