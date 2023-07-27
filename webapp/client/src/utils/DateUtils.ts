export function localTimeToMMDDYYYY(localTime: string | undefined) {
  return localTime === undefined ? '' : `${localTime.slice(5, 7)}/${localTime.slice(8, 10)}/${localTime.slice(0, 4)}`;
}