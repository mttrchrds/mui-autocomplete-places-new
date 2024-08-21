import { useState } from "react";

import "./App.css";
import AutocompleteGoogleMaps from "./AutocompleteGoogleMaps";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import { AutocompletePredictionOuter } from "./types";

const App = () => {
  const [token, setToken] = useState("");
  const [payload, setPayload] = useState<AutocompletePredictionOuter | null>();

  const handleGoogleMapsPlacesAutoCompleteCallback = (
    payload: AutocompletePredictionOuter | null,
    token: string
  ) => {
    setPayload(payload);
    setToken(token);
  };

  const renderInfo = () => {
    if (payload && token) {
      return (
        <Alert severity="info">
          <AlertTitle>Next steps</AlertTitle>A call to the{" "}
          <a
            href="https://developers.google.com/maps/documentation/places/web-service/place-details"
            target="blank"
          >
            Details API
          </a>{" "}
          to retrieve more information about this location could now be made
          using the following parameters:
          <br />
          <br />
          PlaceId: <b>{payload.placePrediction.placeId}</b>
          <br />
          sessionToken: <b>{token}</b>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid xs={12}>
          <Typography variant="h5" gutterBottom>
            MUI Autocomplete component using latest Google Maps Places API
          </Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack spacing={4}>
            <AutocompleteGoogleMaps
              selectedCallback={handleGoogleMapsPlacesAutoCompleteCallback}
            />
            {renderInfo()}
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <pre>
            {payload
              ? JSON.stringify(payload, null, 2)
              : "Select an address from the Autocomplete, details will appear here"}
          </pre>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
