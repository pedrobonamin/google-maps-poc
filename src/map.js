import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Autocomplete,
  LoadScript,
  Marker,
  MarkerClusterer,
  DirectionsRenderer,
} from "@react-google-maps/api";
import MarkerWithInfo from "./marker";
import deliverysPoints from "./qiraPoints.json";
import {
  darkModeStyle,
  mapContainerStyle,
  autoCompleteStyle,
  containerStyle
} from "./mapStyles";

const libraries = ["places", "directions"];

const MyMapWithAutocomplete = () => {
  const [autocomplete, setAutoComplete] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [center, setCenter] = useState({
    lng: -61.44526640390625,
    lat: -33.0044060531599,
  });
  const [markerPosition, setMarkerPostion] = useState();
  const [directionsResponse, setDirectionsResponse] = useState();
  const [selectedQiraPoint, setSelectedQiraPoint] = useState();
  const [distance, setDistance] = useState();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => {
          const latLng = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          };
          setCenter(latLng);
          setMarkerPostion(latLng);
        },
        () =>
          alert(
            "Lo sentimos, tu navegador no soporta geolocalizacion, ingresa tu dirección"
          )
      );
    } else {
      alert(
        "Lo sentimos, tu navegador no soporta geolocalizacion, ingresa tu dirección"
      );
    }
  }, []);

  const onLoad = (map) => {
    setMapRef(map);
    setAutoComplete(map);
  };
  useEffect(() => {
    directionsResponse &&
      setDistance(directionsResponse.routes[0].legs[0].distance.text);
  }, [directionsResponse]);

  const onLoadAutocomplete = (autocomplete) => {
    setAutoComplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const latLng = {
        lat: autocomplete.getPlace().geometry.location.lat(),
        lng: autocomplete.getPlace().geometry.location.lng(),
      };
      setCenter(latLng);
      setMarkerPostion(latLng);
      mapRef.fitBounds(autocomplete.getPlace().geometry.viewport);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const onMarkerDragEnd = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setMarkerPostion({ lat, lng });
  };

  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  };

  return (
    <div style={containerStyle}>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
        libraries={libraries}
      >
        <GoogleMap
          id="google-maps"
          mapContainerStyle={mapContainerStyle}
          zoom={7}
          center={center}
          onLoad={onLoad}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            styles: darkMode && darkModeStyle,
          }}
        >
          <Autocomplete
            onLoad={onLoadAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Ingresá tu dirección"
              style={autoCompleteStyle}
            />
          </Autocomplete>
          {directionsResponse && (
            <DirectionsRenderer options={{ directions: directionsResponse }} />
          )}
          <Marker
            label="Tu ubicación"
            draggable
            onDragEnd={(event) => onMarkerDragEnd(event)}
            position={markerPosition}
            zIndex={10}
          />
          <MarkerClusterer options={options}>
            {(clusterer) =>
              deliverysPoints.map((dp, index) => (
                <MarkerWithInfo
                  key={index}
                  markerPosition={markerPosition}
                  setDirectionsResponse={setDirectionsResponse}
                  index={index}
                  selectedQiraPoint={selectedQiraPoint}
                  setSelectedQiraPoint={setSelectedQiraPoint}
                  dp={dp}
                  clusterer={clusterer}
                />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
        <button onClick={() => setDarkMode(!darkMode)}>darkMode</button>
      </LoadScript>
      {markerPosition && (
        <div style={{ textAlign: "left", margin: "15px" }}>
          Ubicación del marcador
          <br />
          lng: {markerPosition.lng},
          <br />
          lat: {markerPosition.lat}
          <br />
          Distancia: {distance}
        </div>
      )}
      {selectedQiraPoint && (
        <div>Qira point seleccionado: {selectedQiraPoint.name}</div>
      )}
    </div>
  );
};

export default MyMapWithAutocomplete;
