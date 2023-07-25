import { useState, useEffect } from 'preact/hooks';


export default function LiveReadings() {
  const intervalInMs = 5000;


  const [isFetching, setIsFetching] = useState(true);
  const [currentSample, setCurrentSample] = useState<Sample | undefined>(undefined);

  useEffect(() => {
    let timeoutId: number | undefined = undefined;
    if (isFetching) {
      const fetchData = async () => {
        const response = await fetch('/api/samples/current');
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

  return <p>{JSON.stringify(currentSample)}</p>;
}