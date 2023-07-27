import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';

export default function Graph() {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const [date, setDate] = useState<string | undefined>(undefined);

  // to keep track of the date input element
  const dateField = useRef<HTMLInputElement>(null);

  // way around time zones
  useEffect(() => {
    const tzAdjustedDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
    setCurrentDate(tzAdjustedDate);
    setDate(tzAdjustedDate.toISOString().slice(0, 10));
  }, [setDate, setCurrentDate]);

  const [data, setData] = useState<Sample[] | undefined>(undefined);


  const getDailySamples = useCallback(async (date: string) => {
    const response = await fetch(`/api/samples?date=${date}`);
    const result = await response.json();
    if (response.status === 200) {
      setData(result);
    }
  }, [setData]);

  // don't fetch any data before this date--it won't exist!
  const lowerDateBound = Date.parse('2023-07-12');
  useEffect(() => {
    if (date === undefined || currentDate === undefined) return;
    // make sure date is within valid range
    if (date.length > 10) return;
    const parsedDate = Date.parse(date);
    // check that javascript recognizes the date as a date
    if (Number.isNaN(parsedDate)) return;
    // check that date isn't before set lowerDateBound
    if (parsedDate < lowerDateBound) return;
    // check that the selected date isn't in the future
    // add a day of padding because of GMT
    if (parsedDate > currentDate.getTime()) return;

    // we have validated, so now send request
    getDailySamples(date);
  }, [getDailySamples, date, lowerDateBound, currentDate]);

  const chartData = {
    labels: data?.map(d => d.localTime),
    datasets: [{
      label: 'PM 2.5',
      data: data?.map(d => d.pm25),
      fill: false,
      borderColor: 'rgb(255, 0, 0)',
    },
    {
      label: 'PM 1.0',
      data: data?.map(d => d.pm1),
      fill: false,
      borderColor: 'rgb(0, 0, 0)'
    }]
  };

  return (
    <div className="container m-auto">
      {data === undefined ? 
        <p>Loading...</p> :
        <Line data={chartData}/>
      }
      <div className="flex flex-row justify-center">
        <BsFillCaretLeftFill className="cursor-pointer" onClick={() => {
          dateField.current?.stepDown(1);
          setDate(dateField.current?.value);
        }}/>
        <label htmlFor="dateSelect">Select date:</label>
        <input type="date" id="dateSelect" ref={dateField} value={date} onChange={(e) => {
          if (e.target === null) return;
          // need to reassure Typescript we are dealing with an HTML Input Element
          const target = e.target as HTMLInputElement;
          setDate(target.value);
        }}/>
        <BsFillCaretRightFill className="cursor-pointer" onClick={() => {
          dateField.current?.stepUp(1);
          setDate(dateField.current?.value);
        }}/>
      </div>

    </div>
  );
}