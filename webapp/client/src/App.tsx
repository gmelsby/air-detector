import './app.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Root from './Routes/Root';
import LiveReadings from './Routes/LiveReadings';
import ReadingsTable from './Routes/ReadingsTable';
import Graph from './Routes/Graph';
import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to='/table' />
      },
      {
        path: 'live',
        element: <LiveReadings />
      },
      {
        path: 'table',
        element: <ReadingsTable />
      },
      {
        path: 'graph',
        element: <Graph />
      }
    ]
  },
]);

export function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
