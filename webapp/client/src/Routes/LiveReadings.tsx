import { useState, useEffect } from 'preact/hooks';
import { AqiCategory, categorizeAqi, convertPm25ToAqi } from '../Utils/AQIUtils';
import { ComponentChildren } from 'preact';
import QualityColorSquare from '../Components/QualityColorSquare';


export default function LiveReadings() {
  // timeout 
  const intervalInMs = 5000;


  const [isFetching, setIsFetching] = useState(true);
  const [currentAqi, setCurrentAqi] = useState(0);
  const [currentAqiCategory, setCurrentAqiCategory] = useState<AqiCategory | undefined>(undefined);
  const [currentSample, setCurrentSample] = useState<Sample | undefined>(undefined);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    if (isFetching) {
      const fetchData = async () => {
        const response = await fetch('/api/samples/current');
        if (response.status !== 200) {
          console.log('Error fetching current data');
          setIsFetching(false);
          return;
        } 
        const result = await response.json();
        setCurrentSample(result);
        const aqi = convertPm25ToAqi(result.pm25);
        setCurrentAqi(aqi);
        setCurrentAqiCategory(categorizeAqi(aqi));
        setIsFetching(false);
      };

      fetchData();

    }
    // every 5 seconds update sample
    else {
      timeoutId = setTimeout(() => {
        setIsFetching(true);
      }, intervalInMs);
    }

    return () => clearTimeout(timeoutId);

  }, [setCurrentSample, intervalInMs, isFetching, setIsFetching]);

  if (currentSample === undefined) return <p>Loading...</p>;

  return (
    <div className="flex flex-row justify-center flex-wrap max-w-md m-auto px-5">
      {[['PM 1.0', 'pm1'], ['PM 2.5', 'pm25'], ['Particles > 0.3um / 0.1L', 'particles03']].map(([title, sampleKey]) =>
        <DataBox {...{title}} value={currentSample[(sampleKey as keyof Sample)]} key={title}/>
      )}
      <DataBox title="Equivalent AQI" value={currentAqi}>
        <div className="flex flex-row justify-center">
          <QualityColorSquare {...{currentAqiCategory}} />
          <span>
            {categorizeAqi(currentAqi)}
          </span>
        </div>
      </DataBox>
      {isFetching && <p>Updating...</p>}
    </div>
    
  );
}

const DataBox = ({title, value, children}: {title: string, value: number | string, children?: ComponentChildren}) => {
  return (
    <div className="border p-5 w-1/2">
      <h5>{title}</h5>
      <h3>{value}</h3>
      { children }
    </div>
  );
};