import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import RootLayout from './components/RootLayout';
import DjurLayout from './components/DjurLayout';
import Startsida from './pages/Startsida';
import DjurÖversikt from './pages/DjurOversikt';
import DjurDetalj from './pages/DjurDetalj';
import Felsida from './pages/Felsida';


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Felsida />, 
    children: [
      {
        index: true,
        element: <Startsida />,
      },
      {
        path: 'djur',
        element: <DjurLayout />,
        children: [
          {
            index: true,
            element: <DjurÖversikt />,
          },
          {
            path: ':djurId',
            element: <DjurDetalj />,
          },
        ],
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;