import { describe, expect, it, assert } from 'vitest';
import { categorizeAqi, AqiCategory, convertPm25ToAqi } from '../src/utils/AQIUtils';


describe('categorizeAqi tests', () => {
  it('invalid aqi', () => {
    expect(() => categorizeAqi(-5)).toThrowError(/AQI cannot be less than 0/);
  });

  it('good aqi lower bound', () => {
    assert.equal(categorizeAqi(0), AqiCategory.Good);
  });

  it('good aqi upper bound', () => {
    assert.equal(categorizeAqi(50), AqiCategory.Good);
  });

  it('moderate aqi lower bound', () => {
    assert.equal(categorizeAqi(51), AqiCategory.Moderate);
  });
  it('moderate aqi upper bound', () => {
    assert.equal(categorizeAqi(100), AqiCategory.Moderate);
  });

  it('unhealthy for sensitive aqi lower bound', () => {
    assert.equal(categorizeAqi(101), AqiCategory.UnhealthyForSensitiveGroups);
  });

  it('unhealthy for sensitive aqi upper bound', () => {
    assert.equal(categorizeAqi(150), AqiCategory.UnhealthyForSensitiveGroups);
  });

  it('unhealthy lower bound', () => {
    assert.equal(categorizeAqi(151), AqiCategory.Unhealthy);
  });

  it('unhealthy upper bound', () => {
    assert.equal(categorizeAqi(200), AqiCategory.Unhealthy);
  });

  it('very unhealthy lower bound', () => {
    assert.equal(categorizeAqi(201), AqiCategory.VeryUnhealthy);
  });

  it('very unhealthy upper bound', () => {
    assert.equal(categorizeAqi(300), AqiCategory.VeryUnhealthy);
  });

  it('hazardous lower bound', () => {
    assert.equal(categorizeAqi(301), AqiCategory.Hazardous);
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