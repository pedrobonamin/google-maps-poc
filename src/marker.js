import React, { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};
  
const MarkerWithInfo = (props) => {
  const [openInfo, setOpenInfo] = useState(false);
  const icon = {
    url: "https://cdn.onlinewebfonts.com/svg/img_92490.png",
    scaledSize: { width: 24, height: 24 },
  };

  return (
      <Marker
        key={props.dp.position.lng + props.dp.position.lat}
        position={props.dp.position}
        clusterer={props.clusterer}
        icon={icon}
        onClick={() => setOpenInfo(!openInfo)}
        setAnimation='BOUNCE'
      >
        {openInfo && (
          <InfoWindow >
            <div style={divStyle}>
              <h1>QIRA POINT</h1>
              <h3>{props.dp.name}</h3>
              <div>Horarios: Lunes a viernes de 8 a 18</div>
              <button onClick={() => props.setSelectedQiraPoint(props.index)}>Seleccionar DP</button>
            </div>
          </InfoWindow>
        )}
      </Marker>
  );
};

export default MarkerWithInfo;
