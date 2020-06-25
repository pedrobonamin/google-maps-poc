import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Autocomplete,
  LoadScript,
  Marker,
  MarkerClusterer,
  DirectionsRenderer
} from "@react-google-maps/api";
import MarkerWithInfo from "./marker";
import deliverysPoints from "./qiraPoints.json";

const mapContainerStyle = {
  height: "600px",
  width: "1200px",
  margin: "40px",
};

const autoCompleteStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `300px`,
  height: `40px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: "absolute",
  left: "50%",
  top: "2%",
  marginLeft: "-120px",
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const libraries = ["places"];

const MyMapWithAutocomplete = () => {
  const [useLocation, setUseLocation] = useState(false);
  const [autocomplete, setAutoComplete] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [center, setCenter] = useState({
    lng: -61.44526640390625,
    lat: -33.0044060531599,
  });
  const [markerPosition, setMarkerPostion] = useState({
    lng: -61.44526640390625,
    lat: -33.0044060531599,
  });
  const [directionsResponse, setDirectionsResponse] = useState();
  const [selectedQiraPoint, setSelectedQiraPoint] = useState();
  const [distance, setDistance] = useState();

  useEffect(() => {
    if (useLocation) {
      navigator.geolocation.getCurrentPosition((loc) => {
        const latLng = {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        };
        setCenter(latLng);
        setMarkerPostion(latLng);
      });
    }
  }, [useLocation]);

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
      console.log("GET PLACE :", autocomplete.getPlace());
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
        googleMapsApiKey="AIzaSyDaw5GpzQ_oruEhClU651JWYRnAICKPulU"
        libraries={libraries}
      >
        <GoogleMap
          id="searchbox-example"
          mapContainerStyle={mapContainerStyle}
          zoom={5}
          center={center}
          onLoad={onLoad}
          options={{ streetViewControl: false }}
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
            z-index="10"
          />
          <MarkerClusterer options={options}>
            {(clusterer) =>
              deliverysPoints.map((dp, index) => (
                <MarkerWithInfo
                  key={index}
                  markerPosition={markerPosition}
                  setDirectionsResponse={setDirectionsResponse}
                  index={index}
                  setSelectedQiraPoint={setSelectedQiraPoint}
                  dp={dp}
                  clusterer={clusterer}
                />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
      <div style={{ textAlign: "left", margin: "15px" }}>
        Ubicación del marcador
        <br />
        lng: {markerPosition.lng},
        <br />
        lat: {markerPosition.lat}
        <br />
        Distancia: {distance}
      </div>
      <button onClick={() => setUseLocation(!useLocation)}>
        Usar ubicación actual
      </button>
      {selectedQiraPoint && (
        <div>Qira point seleccionado: {selectedQiraPoint.name}</div>
      )}
    </div>
  );
};

export default MyMapWithAutocomplete;
