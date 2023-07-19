import { useState, useEffect } from 'preact/hooks';
import { Sample } from '../Types';


export default function LiveReadings() {
    const intervalInMs = 5000;

    const [currentSample, setCurrentSample] = useState<Sample | undefined>(undefined);

    useEffect(() => {
        // every 5 seconds update sample
        const interval = setInterval(async () => {
            const response = await fetch(`/api/samples/current`);
            const result = await response.json();
            setCurrentSample(result);
        }, intervalInMs)

        return () => clearInterval(interval);

    }, [setCurrentSample, intervalInMs]);

    return <p>{JSON.stringify(currentSample)}</p>;
}