import { useState, useMemo, useRef } from "react";
import { debounce } from "@mui/material/utils";
import { v4 as uuidv4 } from "uuid";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";

interface AutocompleteMatch {
  startOffset?: number;
  endOffset: number;
}

interface AutocompleteStructuredFormatMainText {
  matches: AutocompleteMatch[];
  text: string;
}

interface AutocompleteStructuredFormatSecondaryText {
  text: string;
}

interface AutocompleteStructuredFormat {
  mainText: AutocompleteStructuredFormatMainText;
  secondaryText: AutocompleteStructuredFormatSecondaryText;
}

interface AutocompleteText {
  text: string;
}

interface AutocompletePrediction {
  placeId: string;
  structuredFormat: AutocompleteStructuredFormat;
  text: AutocompleteText;
}

export interface AutocompletePredictionOuter {
  placePrediction: AutocompletePrediction;
}

interface AutocompletePayload {
  suggestions: AutocompletePredictionOuter[];
}

interface AutocompleteGoogleMapsProps {
  selectedCallback: (payload: AutocompletePredictionOuter) => void;
}

const AutocompleteGoogleMaps: React.FC<AutocompleteGoogleMapsProps> = ({
  selectedCallback,
}) => {
  const [value, setValue] = useState<AutocompletePredictionOuter | null>(null);
  const [options, setOptions] = useState<AutocompletePredictionOuter[] | []>(
    []
  );
  // Create our own uuid4 token to send to Google API to take advantage of session usage
  const sessionToken = useRef(uuidv4());

  const fetchGoogleAPI = async (
    url: string,
    requestOptions: RequestInit,
    callback: (payload: AutocompletePredictionOuter) => void
  ) => {
    const response = await fetch(url, requestOptions);

    const parsedResponse = await response.json();

    if (parsedResponse.error) {
      throw new Error(parsedResponse.error);
    } else {
      return callback(parsedResponse);
    }
  };

  const debouncedFetchPlaces = useMemo(
    () =>
      debounce((input, callback) => {
        fetchGoogleAPI(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            headers: {
              "content-type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_API_KEY,
            },
            method: "POST",
            body: JSON.stringify(input),
          },
          callback
        );
      }, 400),
    []
  );

  const handleSelectOption = (newVal: AutocompletePredictionOuter | null) => {
    setValue(newVal);
    if (newVal) {
      selectedCallback(newVal);
      // Reset session token. Token could be used on a call to Details API at this point
      sessionToken.current = uuidv4();
    }
  };

  const handleChangeInput = (newInputVal: string, reason: string) => {
    if (reason === "input" && newInputVal) {
      debouncedFetchPlaces(
        {
          input: newInputVal,
          // Return UK only results
          includedRegionCodes: ["gb"],
          sessionToken: sessionToken.current,
        },
        (payload: AutocompletePayload) => {
          let newOptions: AutocompletePredictionOuter[] = [];

          if (value) {
            newOptions = [value];
          }

          if (payload.suggestions) {
            newOptions = [...newOptions, ...payload.suggestions];
          }

          setOptions(newOptions);
        }
      );
    }
  };

  return (
    <Autocomplete
      id="autocomplete-google-maps"
      autoComplete
      getOptionLabel={(option) => {
        return typeof option === "string"
          ? option
          : option.placePrediction.text.text;
      }}
      options={options}
      filterOptions={(x) => x}
      filterSelectedOptions
      value={value}
      includeInputInList
      onChange={(_, newValue) => {
        handleSelectOption(newValue);
      }}
      onInputChange={(_, newInputValue: string, reason) => {
        handleChangeInput(newInputValue, reason);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search for your location" fullWidth />
      )}
      noOptionsText="No locations"
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const matches =
          option.placePrediction.structuredFormat.mainText.matches || [];
        const parts = parse(
          option.placePrediction.structuredFormat.mainText.text,
          matches.map((match) => [match.startOffset || 0, match.endOffset])
        );
        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: "center" }}>
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.placePrediction.structuredFormat.secondaryText.text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default AutocompleteGoogleMaps;
