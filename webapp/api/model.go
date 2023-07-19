package main

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

const dbPath string = "../../quality.db"

// general skeleton of retrieving samples from sqlite. Query string and parameters can be specified
func GetSamples(queryString string, values ...interface{}) (*[]*Sample, error) {
	// connect to database
	db, err := sql.Open("sqlite3", dbPath)
	defer db.Close()
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	// query database
	rows, err := db.Query(queryString, values...)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	// read rows and put them into slice
	data := []*Sample{}
	for rows.Next() {
		sample := Sample{}
		err = rows.Scan(
			&sample.LocalTime,
			&sample.Pm1,
			&sample.Pm25,
			&sample.Pm1Env,
			&sample.Pm25Env,
			&sample.Particles03,
			&sample.Particles05)

		if err != nil {
			return nil, err
		}
		data = append(data, &sample)
	}
	return &data, nil

}

type GetRecentSamplesParams struct {
	Count  int
	Offset int
}

// gets Count many recent Samples. Offset can be used for a sort of pagination.
func GetRecentSamples(params GetRecentSamplesParams) (*[]*Sample, error) {
	query := `SELECT datetime(dt, 'localtime') as localTime,
  pm_1,
  pm_2_5,
  pm_1_env,
  pm_2_5_env,
  particles_0_3,
  particles_0_5
  FROM Samples
  ORDER BY localTime DESC
  LIMIT ?
  OFFSET ?`

	if params.Count == 0 {
		// default value for count limits to 10
		params.Count = 10
	}

	result, err := GetSamples(query, params.Count, params.Offset)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// extends GetRecentSamplesParams by composition
type GetDaysSamplesParams struct {
	Pagination GetRecentSamplesParams
	Date       string
}

func GetDaysSamples(params GetDaysSamplesParams) (*[]*Sample, error) {
	query := `SELECT datetime(dt, 'localtime') as localTime,
  pm_1,
  pm_2_5,
  pm_1_env,
  pm_2_5_env,
  particles_0_3,
  particles_0_5
  FROM Samples
  WHERE localTime BETWEEN Datetime(?) and Datetime(?)
  ORDER BY localTime
  LIMIT ?
  OFFSET ?
  `

	// put dates, limit (if exists) and offset into a list to be used with the vararg operator
	queryValues := []interface{}{params.Date + " 00:00:00", params.Date + " 23:59:59"}

	// set count to -1 if it's 0--sqlite returns all values in this case
	if params.Pagination.Count == 0 {
		params.Pagination.Count = -1
	}

	// append limit and offset
	queryValues = append(queryValues, params.Pagination.Count)
	queryValues = append(queryValues, params.Pagination.Offset)
	// add offset because if it equals 0 we just execute expected behavior

	result, err := GetSamples(query, queryValues...)
	if err != nil {
		return nil, err
	}

	return result, nil
}
