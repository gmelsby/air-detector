package main

import (
  "net/http"
  "log"
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

  r.Get("/", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.Write([]byte("Hello World!"))
  })

  log.Fatal(http.ListenAndServe("0.0.0.0:" + port, r))
}
