// Functions for converting PM 2.5 to AQI

export enum aqiCategory {
  Good = 'Good',
  Moderate = 'Moderate',
  UnhealthyForSensitiveGroups = 'Unhealthy for Sensitive Groups',
  Unhealthy = 'Unhealthy',
  VeryUnhealthy = 'Very Unhealthy',
  Hazardous = 'Hazardous'
}

const aqiBreakpoints = new Map([
  [0, aqiCategory.Good],
  [51, aqiCategory.Moderate],
  [101, aqiCategory.UnhealthyForSensitiveGroups],
  [151, aqiCategory.Unhealthy],
  [201, aqiCategory.VeryUnhealthy],
  [301, aqiCategory.Hazardous]
]);

// takes in an numeric value, outputs the corresponding aqiCategory
export const categorizeAqi = (aqi: number) => {
  if (aqi < 0) throw new RangeError('AQI cannot be less than 0');
  const categoryKey = Math.max(...([...aqiBreakpoints.keys()]
    .filter(b => b <= aqi)));
  return aqiBreakpoints.get(categoryKey);
};