export interface AutocompleteMatch {
  startOffset?: number;
  endOffset: number;
}

export interface AutocompleteStructuredFormatMainText {
  matches: AutocompleteMatch[];
  text: string;
}

export interface AutocompleteStructuredFormatSecondaryText {
  text: string;
}

export interface AutocompleteStructuredFormat {
  mainText: AutocompleteStructuredFormatMainText;
  secondaryText: AutocompleteStructuredFormatSecondaryText;
}

export interface AutocompleteText {
  text: string;
}

export interface AutocompletePrediction {
  placeId: string;
  structuredFormat: AutocompleteStructuredFormat;
  text: AutocompleteText;
}

export interface AutocompletePredictionOuter {
  placePrediction: AutocompletePrediction;
}

export interface AutocompletePayload {
  suggestions: AutocompletePredictionOuter[];
}
