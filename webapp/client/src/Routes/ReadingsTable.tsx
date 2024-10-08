import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { BsFillCaretLeftFill, BsFillCaretRightFill, BsCaretRight } from 'react-icons/bs';
import { convertPm25ToAqi, categorizeAqi } from '../Utils/AQIUtils';
import QualityColorSquare from '../Components/QualityColorSquare';
import { IconContext } from 'react-icons';
import { localTimeToMMDDYYYY } from '../Utils/DateUtils';

export default function Table() {

  const [data, setData] = useState<Sample[] | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [linesPerPage] = useState(window.innerWidth > 640 ? 15 : 5);
  
  const readingsFetchAbortController = useRef<AbortController>(); // AbortController for fetch request which populates table with samples

  // to be used in useEffect for getting samples
  const getSamples = useCallback(async (pageNumber: number, pageLimit: number) => {
    readingsFetchAbortController.current = new AbortController();
    const response = await fetch(`/api/samples?offset=${pageNumber * pageLimit}&count=${pageLimit}`, {signal: readingsFetchAbortController.current.signal});
    const result = await response.json();
    setData(result);
  }, [setData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => getSamples(page, linesPerPage), 1000);

    return (() => {
      clearTimeout(timeoutId);
      if (readingsFetchAbortController.current) {
        readingsFetchAbortController.current.abort();
      }
    });
  }, [getSamples, page, linesPerPage]);


  return (
    <div className="px-5">
      <table className="table-auto border-separate border-spacing-0 text-left m-auto">
        <thead>
          <tr>
            <td className="border border-slate-600 py-1 px-3 text-center sticky z-10 left-0 bg-white">
              Time
            </td>
            {['PM 1.0', 'PM 2.5', 'Equivalent AQI', 'Particles > 0.3um', 'Particles > 0.5um'].map(label => {
              return <td key={label} className="border border-slate-600 py-1 px-3 text-center">{label}</td>;
            })}
          </tr>
        </thead>
        {data === undefined ? <p>Loading...</p> : data.map(sample => {
          const currentAqi = convertPm25ToAqi(sample.pm25);
          const currentAqiCategory = categorizeAqi(currentAqi);
          return (<tr key={sample.localTime}>
            <td className="border border-slate-700 py-1 px-3 sticky z-10 left-0 bg-white">
              {localTimeToMMDDYYYY(sample.localTime)}
              <b> {sample.localTime.slice(11, 16)}</b>
            </td>
            <td className="border border-slate-700 px-3 py-1">{sample.pm1}</td>
            <td className="border border-slate-700 px-3 py-1">{sample.pm25}</td>
            <td className="border border-slate-700 px-3 py-1">
              <div className="flex flex-row flex-wrap justify-start justify-items-start">
                <QualityColorSquare {...{currentAqiCategory}} />
                <span className="px-1">
                  {`${currentAqi} `}
                </span>
                <span>
                  {currentAqiCategory}
                </span>
                
              </div>
            </td>
          
            <td className="border border-slate-700 px-3 py-1">{sample.particles03}</td>
            <td className="border border-slate-700 px-3 py-1">{sample.particles05}</td>
          </tr>);
        })}
      </table>
      <div className="flex flex-row justify-center my-5">
        <IconContext.Provider value={{
          className: 'cursor-pointer text-2xl',
        }} >
          <div onClick={() => setPage(val => val + 1)}>
            <BsFillCaretLeftFill />
          </div>
        </IconContext.Provider>
        <p className="mx-5">
          page {page}
        </p>
        {page == 0 ? 
          <IconContext.Provider value={{className: 'text-2xl'}}>
            <BsCaretRight /> 
          </IconContext.Provider>
          : 
          <IconContext.Provider value={{className: 'cursor-pointer text-2xl'}}>
            <div onClick={() => setPage(val => Math.max(0, val - 1))}>
              <BsFillCaretRightFill />
            </div>
          </IconContext.Provider>
        }
      </div>
    </div>
  );
}