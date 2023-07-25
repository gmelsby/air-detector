import { Outlet, Link } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <div> 
        <h1>Air Quality Monitor</h1>
        <nav>
          <ul>
            <li>
              <Link to={'/live'}>Live Readings</Link>
            </li>
            <li>
              <Link to={'/table'}>Table</Link>
            </li>
            <li>
              <Link to={'/graph'}>Graph</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}