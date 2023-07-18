package main

import (
	"net/http"
  "strconv"
	"github.com/go-chi/render"
  "encoding/json"
  "os/exec"
)

const PathToPm2_5 = "/home/pi/air-detector/pm2_5/"

// handles the GET /samples endpoint
func ListSamples(w http.ResponseWriter, r *http.Request) {
  params := GetRecentSamplesParams{}

  // check for query parameters
  queryParams := r.URL.Query()
  if offset := queryParams.Get("offset"); offset != "" {
    // make sure we have an integer
    offsetParam, err := strconv.Atoi(offset)
    if err != nil {
      render.Render(w, r, ErrBadRequest(err))
      return
    }
    params.Offset = offsetParam
  }
  if count := queryParams.Get("count"); count != "" {
    // make sure we have an integer
    countParam, err := strconv.Atoi(count)
    if err != nil {
      render.Render(w, r, ErrBadRequest(err))
      return
    }
    params.Count = countParam
  }


  // get data from db
  data, err := GetRecentSamples(params)
  if err != nil {
    render.Render(w, r, ErrUnavailable(err))
    return
  }

  // send data back
	if err := render.RenderList(w, r, SampleListResponse(data)); err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}


// uses exec to run python program which returns current measurements
func ReadCurrentSample(w http.ResponseWriter, r *http.Request) {
  reading, err := exec.Command(PathToPm2_5 + ".venv/bin/python", PathToPm2_5 + "detector.py").Output()
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

	if err := render.Render(w, r, &results); err != nil {
		render.Render(w, r, ErrRender(err))
  }
}

// placeholder until python script is modified and called as exec()
func CreateSample(w http.ResponseWriter, r *http.Request) {
	if err := render.Render(w, r, &Sample{"hello", 2, 2, 2, 2, 2, 2}); err != nil {
		return
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
func SampleListResponse(samples []*Sample) []render.Renderer {
  list := []render.Renderer{}
  for _, sample := range samples {
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
  return &ErrResponse {
    Err:  err,
    HTTPStatusCode: 400,
    StatusText: "Bad Request",
    ErrorText: err.Error(),
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
