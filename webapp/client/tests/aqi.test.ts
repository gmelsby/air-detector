import { describe, expect, it, assert } from 'vitest';
import { categorizeAqi, aqiCategory } from '../src/utils/AQIUtils';


describe('categorizeAqi tests', () => {
  it('invalid aqi', () => {
    expect(() => categorizeAqi(-5)).toThrowError(/AQI cannot be less than 0/);
  });

  it('good aqi lower bound', () => {
    assert.equal(categorizeAqi(0), aqiCategory.Good);
  });

  it('good aqi upper bound', () => {
    assert.equal(categorizeAqi(50), aqiCategory.Good);
  });

  it('moderate aqi lower bound', () => {
    assert.equal(categorizeAqi(51), aqiCategory.Moderate);
  });
  it('moderate aqi upper bound', () => {
    assert.equal(categorizeAqi(100), aqiCategory.Moderate);
  });

  it('unhealthy for sensitive aqi lower bound', () => {
    assert.equal(categorizeAqi(101), aqiCategory.UnhealthyForSensitiveGroups);
  });

  it('unhealthy for sensitive aqi upper bound', () => {
    assert.equal(categorizeAqi(150), aqiCategory.UnhealthyForSensitiveGroups);
  });

  it('unhealthy lower bound', () => {
    assert.equal(categorizeAqi(151), aqiCategory.Unhealthy);
  });

  it('unhealthy upper bound', () => {
    assert.equal(categorizeAqi(200), aqiCategory.Unhealthy);
  });

  it('very unhealthy lower bound', () => {
    assert.equal(categorizeAqi(201), aqiCategory.VeryUnhealthy);
  });

  it('very unhealthy upper bound', () => {
    assert.equal(categorizeAqi(300), aqiCategory.VeryUnhealthy);
  });

  it('hazardous lower bound', () => {
    assert.equal(categorizeAqi(301), aqiCategory.Hazardous);
  });



});