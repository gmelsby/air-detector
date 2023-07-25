import { Outlet, NavLink } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <div className="text-center content-center"> 
        <h1 className="text-2xl my-2">Air Quality Monitor</h1>
        <nav className="my-2">
          <ul className="flex flex-row justify-center">
            <li className="mx-2">
              <NavLink to={'/live'} className={({ isActive }: {isActive: boolean}) => isActive ? 'text-l inline-block border border-gray-600 rounded py-1 px-3 bg-gray-600 text-white' : 'text-l inline-block border rounded py-1 px-3 border-gray-200 bg-gray-200 text-black'}>
                Live Readings
              </NavLink>
            </li>
            <li className="mx-2">
              <NavLink to={'/table'} className={({ isActive }: {isActive: boolean}) => isActive ? 'text-l inline-block border border-gray-600- rounded py-1 px-3 bg-gray-600 text-white' : 'text-l inline-block border rounded py-1 px-3 border-gray-200 bg-gray-200 text-black'}>
                Table
              </NavLink>
            </li>
            <li className="mx-2">
              <NavLink to={'/graph'} className={({ isActive }: {isActive: boolean}) => isActive ? 'text-l inline-block border border-gray-600 rounded py-1 px-3 bg-gray-600 text-white' : 'text-l inline-block border rounded py-1 px-3 border-gray-200 bg-gray-200 text-black'}>
                Graph
              </NavLink>
            </li>
          </ul>
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}