import { useState, useEffect, useCallback } from 'preact/hooks';
import { BsFillCaretLeftFill, BsFillCaretRightFill, BsCaretRight } from 'react-icons/bs';

export default function Table() {
  const [data, setData] = useState<Sample[] | undefined>(undefined);
  const [page, setPage] = useState(0);
  const linesPerPage = 15;
  
  // to be used in useEffect for getting samples
  const getSamples = useCallback(async (pageNumber: number, pageLimit: number) => {
    const response = await fetch(`/api/samples?offset=${pageNumber * pageLimit}&count=${pageLimit}`);
    const result = await response.json();
    setData(result);
  }, [setData]);

  useEffect(() => {
    getSamples(page, linesPerPage);
  }, [getSamples, page, linesPerPage]);


  return (
    <div>
      <table className="table-auto border border-collapse border-slate-500 text-right m-auto">
        <thead>
          <tr>
            {['Time', 'PM 1.0', 'PM 2.5', 'Particles > 0.3um', 'Particles > 0.5um'].map(label => {
              return <td key={label} className="border border-slate-600 py-1 px-3 text-center">{label}</td>;
            })}
          </tr>
        </thead>
        {data === undefined ? <p>Loading...</p> : data.map(sample => {
          return (<tr key={sample.localTime}>
            <td className="border border-slate-700 px-3 py-1">{sample.localTime}</td>
            <td className="border border-slate-700 px-3 py-1">{sample.pm1}</td>
            <td className="border border-slate-700 px-3 py-1">{sample.pm25}</td>
            <td className="border border-slate-700 px-3 py-1">{sample.particles03}</td>
            <td className="border border-slate-700 px-3 py-1">{sample.particles05}</td>
          </tr>);
        })}
      </table>
      <div className="flex flex-row justify-center">
        <BsFillCaretLeftFill className="cursor-pointer" onClick={() => setPage(val => val + 1)}/>
        <p>
          page {page}
        </p>
        {page == 0 ? <BsCaretRight /> : 
          <BsFillCaretRightFill className="cursor-pointer" onClick={() => setPage(val => Math.max(0, val - 1))}/>
        }
      </div>
    </div>
  );
}