function read(path) {
  return require(`!!raw-loader?esModule=false!./${path}`)
}

const examplePaths = [
  "apiv2-examples/aggregate-request.json",
  "apiv2-examples/aggregate-response.json",
  "apiv2-examples/timeseries-request.json",
  "apiv2-examples/timeseries-response.json",
  "apiv2-examples/time-labels-request.json",
  "apiv2-examples/time-labels-response.json",
  "apiv2-examples/custom-date-range-request.json",
  "apiv2-examples/custom-date-range-response.json",
  "apiv2-examples/utm-request.json",
  "apiv2-examples/utm-response.json",
  "apiv2-examples/filtering-basics-request.json",
  "apiv2-examples/filtering-basics-response.json",
  "apiv2-examples/country-and-city-request.json",
  "apiv2-examples/country-and-city-response.json",
]

export default Object.fromEntries(examplePaths.map((path) => [path, read(path)]))
