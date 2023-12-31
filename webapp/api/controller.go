package main

import (
	"encoding/json"
	"github.com/go-chi/render"
	"net/http"
	"os/exec"
	"strconv"
	"time"
)

const PathToPm2_5 = "/home/pi/air-detector/pm2_5/"

// handles the GET /samples endpoint
func ListSamples(w http.ResponseWriter, r *http.Request) {
	getRecentSamplesArgs := GetRecentSamplesParams{}

	// check for query parameters
	queryParams := r.URL.Query()
	if offset := queryParams.Get("offset"); offset != "" {
		// make sure we have an integer
		offsetParam, err := strconv.Atoi(offset)
		if err != nil {
			render.Render(w, r, ErrBadRequest(err))
			return
		}
		getRecentSamplesArgs.Offset = offsetParam
	}

	if count := queryParams.Get("count"); count != "" {
		// make sure we have an integer
		countParam, err := strconv.Atoi(count)
		if err != nil {
			render.Render(w, r, ErrBadRequest(err))
			return
		}
		getRecentSamplesArgs.Count = countParam
	}

	var data *[]*Sample
	var err error

	// if we have a date parameter verify it and send to GetDaysSamples
	if date := queryParams.Get("date"); date != "" {
		layout := "2006-01-02"
		// if date is not in YYYY-MM-DD format send back error
		if _, err = time.Parse(layout, date); err != nil {
			render.Render(w, r, ErrBadRequest(err))
			return
		}
		// pack up arguments in struct and send to GetDaysSamples
		getDaysSamplesArgs := GetDaysSamplesParams{getRecentSamplesArgs, date}
		data, err = GetDaysSamples(getDaysSamplesArgs)
		if err != nil {
			render.Render(w, r, ErrUnavailable(err))
			return
		}

	} else {
		// otherwise we have a request for recent samples
		data, err = GetRecentSamples(getRecentSamplesArgs)
		if err != nil {
			render.Render(w, r, ErrUnavailable(err))
			return
		}
	}

	// send data back
	if err := render.RenderList(w, r, SampleListResponse(data)); err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}

// returns function that uses exec to run python program which returns current measurements
// parameter determines whether read data will be saved or not
// resulting function returns request with 200 if sample not saved, 201 if saved
func ReadCurrentSampleFactory(saveResults bool) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// put our cli arguments in a list and add the flag if necessary
		execArgs := []string{PathToPm2_5 + "detector.py"}
		if saveResults {
			execArgs = append(execArgs, "-s")
		}

		// get current reading
		reading, err := exec.Command(PathToPm2_5+".venv/bin/python", execArgs...).Output()
		if err != nil {
			render.Render(w, r, ErrUnavailable(err))
			return
		}

		// parse json
		var results Sample
		if err := json.Unmarshal(reading, &results); err != nil {
			render.Render(w, r, ErrUnavailable(err))
			return
		}

		// set code to 201 if we have saved data to db
		if saveResults {
			render.Status(r, http.StatusCreated)
		}

		// return results
		if err := render.Render(w, r, &results); err != nil {
			render.Render(w, r, ErrRender(err))
		}
	}
}

type Sample struct {
	LocalTime   string `json:"localTime"`
	Pm1         int    `json:"pm1"`
	Pm25        int    `json:"pm25"`
	Pm1Env      int    `json:"pm1env"`
	Pm25Env     int    `json:"pm25env"`
	Particles03 int    `json:"particles03"`
	Particles05 int    `json:"particles05"`
}

// convey that Sample is able to be rendered
func (*Sample) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

// allows a list of samples to be rendered
func SampleListResponse(samples *[]*Sample) []render.Renderer {
	list := []render.Renderer{}
	for _, sample := range *samples {
		list = append(list, sample)
	}

	return list
}

type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}

// sends 400 code
func ErrBadRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Bad Request",
		ErrorText:      err.Error(),
	}
}

// sends 503 code
func ErrUnavailable(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 503,
		StatusText:     "The requested resource is currently unavailable",
		ErrorText:      err.Error(),
	}
}
