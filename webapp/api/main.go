package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
)

func main() {
	port := "3000"

	if fromEnv := os.Getenv("PORT"); fromEnv != "" {
		port = fromEnv
	}

	log.Printf("Starting up on port %s", port)

	r := chi.NewRouter()

	r.Route("/samples", func(r chi.Router) {
		// gets list of samples
		r.Get("/", ListSamples)
		// create new sample at current time
		r.Post("/", ReadCurrentSampleFactory(true))
		// read current sample at current time but do not write to db
		r.Get("/current", ReadCurrentSampleFactory(false))
	})

	// placeholder route for root route
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("Welcome to the API!"))
	})

	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, r))
}
