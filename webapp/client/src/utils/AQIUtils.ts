// Functions for converting PM 2.5 to AQI

export enum aqiCategory {
  Good = 'Good',
  Moderate = 'Moderate',
  UnhealthyForSensitiveGroups = 'Unhealthy for Sensitive Groups',
  Unhealthy = 'Unhealthy',
  VeryUnhealthy = 'Very Unhealthy',
  Hazardous = 'Hazardous'
}

// map from AQI to air quality category
const aqiBreakpoints = new Map([
  [0, aqiCategory.Good],
  [51, aqiCategory.Moderate],
  [101, aqiCategory.UnhealthyForSensitiveGroups],
  [151, aqiCategory.Unhealthy],
  [201, aqiCategory.VeryUnhealthy],
  [301, aqiCategory.Hazardous],
  [401, aqiCategory.Hazardous],
  [500, aqiCategory.Hazardous]
]);

// map from PM 2.5 breakpoints to AQI breakpoints
const pm25Breakpoints = new Map ([
  [0, 0],
  [12.0, 50],
  [12.1, 51],
  [35.4, 100],
  [35.5, 101],
  [55.4, 150],
  [55.5, 151],
  [150.4, 200],
  [150.5, 201],
  [250.4, 300],
  [250.5, 301],
  [350.4, 400],
  [350.5, 401],
  [500.4, 500]
]);

// takes in an numeric value, outputs the corresponding aqiCategory
export const categorizeAqi = (aqi: number) => {
  if (aqi < 0) throw new RangeError('AQI cannot be less than 0');
  const categoryKey = Math.max(...([...aqiBreakpoints.keys()]
    .filter(b => b <= aqi)));
  return aqiBreakpoints.get(categoryKey);
};

export const convertPm25ToAqi = (pm25: number) => {
  // truncate to one decimal place
  pm25 = Math.trunc(pm25 * 10) / 10;

  // validate input
  if (pm25 < 0) throw new RangeError('PM 2.5 cannot be less than 0');
  // concentration breakpoint <= pm25
  const bpLow = Math.max(...([...pm25Breakpoints.keys()]
    .filter(b => b <= pm25)));
  // concentration breakpoint > pm25
  const bpHigh = Math.min(...([...pm25Breakpoints.keys()]
    .filter(b => b > pm25)));

  console.log(bpHigh);
  // case where there were no higher breakpoints, so we are off the high end of the scale
  if (bpHigh === 0 || bpHigh === Infinity) return 500;

  // get the corresponding values on the AQI breakpoint scale
  const iLow = pm25Breakpoints.get(bpLow);
  const iHigh = pm25Breakpoints.get(bpHigh);

  if (iLow === undefined || iHigh === undefined) {
    throw Error('Map key did not exist');
  }

  console.log(`${JSON.stringify({iLow, iHigh, bpLow, bpHigh})}`);

  const unroundedAqi = ((iHigh - iLow) / (bpHigh - bpLow)) * (pm25 - bpLow) + iLow;
  return Math.round(unroundedAqi);
};