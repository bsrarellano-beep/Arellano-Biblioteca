import { Route } from '@angular/router';

import { MyComponent } from '@/app/pages/my-component/my-component';
import { AdminLayout } from '@/app/domains/admin/layout/layout';

export const routes: Route[] = [
  {
    path: 'pages',
    component: AdminLayout,
    children: [
      {
        path: 'my-route',
        component: MyComponent,
      },
      {
        path: 'books',
        component: MyComponent,
      },

      // Ruta de videos
      {
        path: 'videos',
        loadChildren: () =>
          import('./pages/videos/routes'),
      },
    ],
  },

  // Website routes
  {
    path: 'home',
    loadChildren: () => import('./domains/website/routes'),
  },

  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Admin
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin',
  },
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/routes'),
  },

  // Coming soon
  {
    path: 'coming-soon',
    loadChildren: () => import('./domains/coming-soon/routes'),
  },

  // Maintenance
  {
    path: 'maintenance',
    loadChildren: () => import('./domains/maintenance/routes'),
  },
];