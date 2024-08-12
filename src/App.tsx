import "./App.css";
import AutocompleteGoogleMaps, {
  AutocompletePredictionOuter,
} from "./AutocompleteGoogleMaps";

const App = () => {
  const handleGoogleMapsPlacesAutoCompleteCallback = (
    payload: AutocompletePredictionOuter
  ) => {
    console.log("SELECTED OPTION", payload);
  };

  return (
    <div className="page-content">
      <div className="autocomplete-container">
        <AutocompleteGoogleMaps
          selectedCallback={handleGoogleMapsPlacesAutoCompleteCallback}
        />
      </div>
    </div>
  );
};

export default App;
