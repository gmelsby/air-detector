package main

import (
  "database/sql"
  "log"
	_ "github.com/mattn/go-sqlite3"
)


const dbPath string = "../../quality.db"

type GetRecentSamplesParams struct {
  Count int 
  Offset  int
}

func GetRecentSamples(params GetRecentSamplesParams) ([]*Sample, error) {
  db, err := sql.Open("sqlite3", dbPath)
  defer db.Close()
  if err != nil {
    log.Fatal(err)
    return nil, err
  }



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
    params.Count  = 10
  }
  

  rows, err := db.Query(query, params.Count, params.Offset)
  defer rows.Close()
  if err != nil {
    log.Fatal(err)
    return nil, err
  }
  

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
  return data, nil
}
