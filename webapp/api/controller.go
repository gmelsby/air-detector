package main

import (
	"net/http"
	"github.com/go-chi/render"
)

func ListSamples(w http.ResponseWriter, r *http.Request) {
  params := GetRecentSamplesParams{}
  data, err := GetRecentSamples(params)
  if err != nil {
    render.Render(w, r, ErrRender(err))
    return
  }

	if err := render.RenderList(w, r, SampleListResponse(data)); err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}

func CreateSample(w http.ResponseWriter, r *http.Request) {
	if err := render.Render(w, r, &Sample{"hello", 2, 2, 2, 2, 2, 2}); err != nil {
		render.Render(w, r, ErrRender(err))
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

func (*Sample) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

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
