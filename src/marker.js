import React, { useState, useMemo } from "react";
import { Marker, InfoWindow, DirectionsService } from "@react-google-maps/api";

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};
  
const MarkerWithInfo = (props) => {
  const [openInfo, setOpenInfo] = useState(false);
  const icon = {
    url: "https://cdn.onlinewebfonts.com/svg/img_92490.png",
    scaledSize: { width: 24, height: 24 }  
  };
  const [distance, setDistance] = useState()
  const [response, setResponse] = useState()
  const [selected, setSelected] = useState(false)


  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDistance(response.routes[0].legs[0].distance.text);
        setResponse(response)
        selected && props.setDirectionsResponse(response)
      } else {
        console.log("response: ", response);
      }
    }
  };

  const Directions = useMemo(() => {
      return (
        <DirectionsService
          options={{
            destination: props.dp.position,
            origin: props.markerPosition,
            travelMode: "DRIVING",
          }}
          callback={(response) => directionsCallback(response)}
        />
      );
      // eslint-disable-next-line 
  }, [props.markerPosition]);

  const selectQiraPoint = () => {
    props.setDirectionsResponse(!selected ? response: undefined)
    props.setSelectedQiraPoint(!selected ? props.dp: undefined)
    setSelected(!selected)
  }
  return (
      <Marker
        key={props.dp.position.lng + props.dp.position.lat}
        position={props.dp.position}
        clusterer={props.clusterer}
        icon={icon}
        onClick={() => setOpenInfo(!openInfo)}
        setAnimation='BOUNCE'
      >
        {Directions}
        {openInfo && (
          <InfoWindow >
            <div style={divStyle}>
              <h1>QIRA POINT</h1>
              <h3>{props.dp.name}</h3>
              <div>Horarios: Lunes a viernes de 8 a 18</div>
                <h3>Distancia de envío: {distance} </h3>
              <button onClick={selectQiraPoint}>
                 {selected ? 'Cancelar' :'Seleccionar' } Qira Point
                  </button>
            </div>
          </InfoWindow>
        )}
      </Marker>
  );
};

export default MarkerWithInfo;
