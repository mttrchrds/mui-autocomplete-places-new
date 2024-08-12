# MUI Autocomplete component (using latest Google Maps API)

MUI's docs provide an example Autocomplete component which uses the Google Maps Places API:

https://mui.com/material-ui/react-autocomplete/#google-maps-place

Unfortunately this example uses the legacy version of the Google Maps API.

This repo creates an updated version of this example component which utilises the latest API (https://developers.google.com/maps/documentation/javascript/place-autocomplete-overview).

A live demo of this repo can be found here: https://mui-autocomplete-places-new.onrender.com

## Install locally

Firstly, clone this repo. Then run usual Vite commands i.e.:

- `npm install`
- `npm run dev`
- `npm run build`

Create a ".env" file at the root of your project. Add the following line with your own Google API key

`VITE_GOOGLE_API_KEY="XYZ"`
