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
import { BsCaretRight, BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { localTimeToMMDDYYYY } from '../Utils/DateUtils';

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

  useEffect(() => {
    // way around time zones
    // manually add in the time zone offset
    const tzAdjustedDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000);
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
    if (parsedDate > currentDate.getTime()) return;

    // we have validated, so now send request
    getDailySamples(date);
  }, [getDailySamples, date, lowerDateBound, currentDate]);

  const chartData = {
    labels: data?.map(d => d.localTime.slice(11, 16)),
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
    }],
  };

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: `Readings on ${localTimeToMMDDYYYY(data?.[0].localTime)}`
      }
    }
  };

  return (
    <div className="container m-auto">
      {data === undefined ? 
        <p>Loading...</p> :
        <Line data={chartData} options={chartOptions}/>
      }
      <div className="flex flex-row justify-center my-5">
        <BsFillCaretLeftFill className="cursor-pointer text-2xl" onClick={() => {
          dateField.current?.stepDown(1);
          setDate(dateField.current?.value);
        }}/>
        <div className="mx-5">
          <label htmlFor="dateSelect">Date:</label>
          <input type="date" id="dateSelect" ref={dateField} value={date} onChange={(e) => {
            if (e.target === null) return;
            // need to reassure Typescript we are dealing with an HTML Input Element
            const target = e.target as HTMLInputElement;
            setDate(target.value);
          }}/>
        </div>
        {currentDate === undefined
        || dateField.current?.value === undefined 
        || currentDate.getTime() < Date.parse(dateField.current?.value) + 86_400_000? // check that the day we are trying to move forward to is not in the future
          <BsCaretRight className="text-2xl" /> :
          <BsFillCaretRightFill className="cursor-pointer text-2xl" onClick={() => {
            dateField.current?.stepUp(1);
            setDate(dateField.current?.value);
          }}/>
        }
      </div>

    </div>
  );
}