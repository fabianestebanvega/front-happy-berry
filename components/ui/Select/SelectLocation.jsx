import React, { useState ,useEffect} from "react";

const SelectLocation = () => {
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const apiKey="AIzaSyDfpdNDilsvK7MCtsdmv7lwZ567Yx9Pqv0"
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.onload = () => setGoogleMapsLoaded(true);
        document.head.appendChild(script);
      }
    };

    loadGoogleMaps();
  }, []);

  const handleChange = (event) => {
    const inputAddress = event.target.value;
    setAddress(inputAddress);

    if (inputAddress.trim() !== "" && googleMapsLoaded) {
      const autoCompleteService = new window.google.maps.places.AutocompleteService();
      autoCompleteService.getPlacePredictions(
        { input: inputAddress, types: ["address"], componentRestrictions: { country: "CO" } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPredictions(predictions);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handleSelect = (prediction) => {
    console.log(prediction)
    setAddress(prediction.description);
    setPredictions([]);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Escribe tu dirección"
        value={address}
        onChange={handleChange}
      />
      <ul>
        {predictions.map((prediction) => (
          <li key={prediction.place_id} onClick={() => handleSelect(prediction)}>
            {prediction.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectLocation;
