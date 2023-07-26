import { describe, expect, it, assert } from 'vitest';
import { categorizeAqi, aqiCategory, convertPm25ToAqi } from '../src/utils/AQIUtils';


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

describe('convertPm25ToAqi tests', () => {
  it('invalid aqi', () => {
    expect(() => convertPm25ToAqi(-5)).toThrowError(/PM 2.5 cannot be less than 0/);
  });

  it('pm25 of 0', () => {
    assert.equal(convertPm25ToAqi(0), 0);
  });

  it('pm25 of 12', () => {
    assert.equal(convertPm25ToAqi(12), 50);
  });

  it('pm25 of 12.1', () => {
    assert.equal(convertPm25ToAqi(12.1), 51);
  });

  it('pm25 of 35.4', () => {
    assert.equal(convertPm25ToAqi(35.4), 100);
  });


  it('pm25 of 35.5', () => {
    assert.equal(convertPm25ToAqi(35.5), 101);
  });

  it('pm25 of 55.4', () => {
    assert.equal(convertPm25ToAqi(55.4), 150);
  });

  it('pm25 of 55.5', () => {
    assert.equal(convertPm25ToAqi(55.5), 151);
  });

  it('pm25 of 150.4', () => {
    assert.equal(convertPm25ToAqi(150.4), 200);
  });

  it('pm25 of 150.5', () => {
    assert.equal(convertPm25ToAqi(150.5), 201);
  });

  it('pm25 of 250.4', () => {
    assert.equal(convertPm25ToAqi(250.4), 300);
  });

  it('pm25 of 250.5', () => {
    assert.equal(convertPm25ToAqi(250.5), 301);
  });

  it('pm25 of 350.4', () => {
    assert.equal(convertPm25ToAqi(350.4), 400);
  });

  it('pm25 of 350.5', () => {
    assert.equal(convertPm25ToAqi(350.5), 401);
  });

  it('pm25 of 500.4', () => {
    assert.equal(convertPm25ToAqi(500.5), 500);
  });

  it('pm25 off the charts', () => {
    assert.equal(convertPm25ToAqi(10000), 500);
  });









});