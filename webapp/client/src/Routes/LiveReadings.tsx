import { useState, useEffect } from 'preact/hooks';


export default function LiveReadings() {
  // timeout 
  const intervalInMs = 5000;


  const [isFetching, setIsFetching] = useState(true);
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
    </div>
    
  );
}

const DataBox = ({title, value}: {title: string, value: number | string}) => {
  return (
    <div className="border p-5 w-1/2">
      <h5>{title}</h5>
      <h3>{value}</h3>
    </div>
  );
};