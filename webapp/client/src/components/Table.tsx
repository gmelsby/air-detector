import { useState, useEffect, useCallback } from 'preact/hooks';
import { BsFillCaretLeftFill, BsFillCaretRightFill, BsCaretRight } from 'react-icons/bs';
import { Sample } from '../Types';



export default function Table() {
  const [data, setData] = useState<Sample[]>([]);
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
    <>
      <table>
        <tr>
          <th>
            {['Time', 'PM 1.0', 'PM 2.5', 'Particles > 0.3um', 'Particles > 0.5um']}
          </th>
        </tr>
        {data.map(sample => {
          return (<tr key={sample.localTime}>
            <td>{sample.localTime}</td>
            <td>{sample.pm1}</td>
            <td>{sample.pm25}</td>
            <td>{sample.particles03}</td>
            <td>{sample.particles05}</td>
          </tr>);
        })}
      </table>
      <p>
        <BsFillCaretLeftFill onClick={() => setPage(val => val + 1)}/>
      page {page}
        {page == 0 ? <BsCaretRight /> : 
          <BsFillCaretRightFill onClick={() => setPage(val => Math.max(0, val - 1))}/>
        }
      </p>
    </>
  );
}