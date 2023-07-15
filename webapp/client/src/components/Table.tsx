import { useState, useEffect, useCallback } from 'preact/hooks';

interface Sample {
    localTime: string;
    pm1: number;
    pm25: number;
    pm1env: number;
    pm25env: number;
    particles03: number;
    particles05: number;
}

export default function Table() {
  const [data, setData] = useState<Sample[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const getSamples = useCallback(async () => {
    setIsLoading(true)
    const response = await fetch(`/api/samples`);
    const result = await response.json()
    setData(result)
    setIsLoading(false)
  }, [setIsLoading, setData]);

  useEffect(() => {
    getSamples()
  }, [getSamples]);

  if (data.length !== 0) {
    console.log("updated")
  }

  return (
    <table>
      <tr>
        <th>
          {['Time', 'PM 1.0', 'PM 2.5', 'Particles > 0.3um', 'Particles > 0.5um']}
        </th>
      </tr>
      {isLoading ? <p>Loading...</p>: data.map(sample => {
        return (<tr key={sample.localTime}>
          <td>{sample.localTime}</td>
          <td>{sample.pm1}</td>
          <td>{sample.pm25}</td>
          <td>{sample.particles03}</td>
          <td>{sample.particles05}</td>
        </tr>)
      })}
    </table>
  );
}