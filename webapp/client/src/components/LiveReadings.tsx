import { useState, useEffect } from 'preact/hooks';
import { Sample } from '../Types';


export default function LiveReadings() {
  const intervalInMs = 5000;


  const [isFetching, setIsFetching] = useState(false);
  const [currentSample, setCurrentSample] = useState<Sample | undefined>(undefined);

  useEffect(() => {
    if (isFetching) return;
    // every 5 seconds update sample
    const timeout = setTimeout(async () => {
      setIsFetching(true);
      const response = await fetch('/api/samples/current');
      const result = await response.json();
      setCurrentSample(result);
      setIsFetching(false);
      console.log('received data');
    }, intervalInMs);

    return () => clearTimeout(timeout);

  }, [setCurrentSample, intervalInMs, isFetching, setIsFetching]);

  return <p>{JSON.stringify(currentSample)}</p>;
}