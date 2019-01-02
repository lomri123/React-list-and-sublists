import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
const AnyReactComponent = ({ text }) => (
  <div>
    <img
      src="https://img.icons8.com/color/50/000000/marker.png"
      alt="map-baloon"
    />{" "}
    {text}
  </div>
);

class SimpleMap extends Component {
  render() {
    const { lat, lng } = this.props.center;
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCIBNLY0r4t9t63aRY1VZUTYE1YH0NCCKs" }}
          defaultZoom={20}
          // these details will be passed through the getGeoCode function
          center={{
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          }}
        >
          {/* creating the marker for the map */}
          <AnyReactComponent
            lat={parseFloat(lat)}
            lng={parseFloat(lng)}
            text={this.props.markerTitle}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
