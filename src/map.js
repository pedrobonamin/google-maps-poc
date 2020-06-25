import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Autocomplete,
  LoadScript,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import MarkerWithInfo from "./marker";
import deliverysPoints from './qiraPoints.json'

const mapContainerStyle = {
  height: "400px",
  width: "800px",
  margin: '40px'
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}
const libraries = ["places"];

const MyMapWithAutocomplete = () => {
  const [useLocation, setUseLocation] = useState(false);
  const [autocomplete, setAutoComplete] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [center, setCenter] = useState({
    lng: -60.5745999,
    lat: -33.8912831,
  });
  const [markerPosition, setMarkerPostion] = useState({
    lng: -60.5745999,
    lat: -33.8912831,
  });

  // To set users current location
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
    console.log("coord", event);
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
          options={{
            streetViewControl: false,
          }}
        >
          <Autocomplete
            onLoad={onLoadAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Ingresá tu dirección"
              style={{
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
              }}
            />
          </Autocomplete>
          <Marker
            label="Tu ubicación"
            draggable
            onDrag={() => console.log("ON DRAG")}
            onDragEnd={(event) => onMarkerDragEnd(event)}
            position={markerPosition}
          />
          <MarkerClusterer options={options}>
            {(clusterer) =>
              deliverysPoints.map((dp) => (
                <MarkerWithInfo dp={dp} clusterer={clusterer} />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
      <div style={{ textAlign: "left" , margin: '15px'}}>
        Ubicación del marcador
        <br />
        lng: {markerPosition.lng},
        <br />
        lat: {markerPosition.lat}
      </div>

      <button onClick={() => setUseLocation(!useLocation)}>
        Usar ubicación actual
      </button>
    </div>
  );
};

export default MyMapWithAutocomplete;
