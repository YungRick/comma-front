import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

import { GoogleMap, Marker, withGoogleMap, withScriptjs, Polyline } from "react-google-maps"

const getPl = path => {
    return <Polyline
        geodesic={true}
        options={{
            path: path,
            strokeColor: 1 + 1 === 34 ? '#FF0000' : '#FFFF00',
            strokeOpacity: 1,
            strokeWeight: 6,
            icons: [{
                offset: '0',
                repeat: '10px'
            }],
        }}
    />
}


const MyMapComponent = withScriptjs(withGoogleMap((props) =>{
    console.log(props)
     return <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: 37.774929, lng: -122.419418 }}
        >
            {props.polylines}
            {props.isMarkerShown && <Marker position={{ lat: 37.774929, lng: -122.419418 }} />}
        </GoogleMap>
}
))
//<MyMapComponent isMarkerShown={false} />// Just only Map

class App extends Component {
    constructor(){
        super()
        this.state = {
            route: null,
            polylines: null
        }
    }

    componentDidMount(){
        this.getData();
    }

    getColor = speed => {
        var r, g, b = 0;
        if(speed < 50) {
            r = 255;
            g = Math.round(5.1 * speed);
        }
        else {
            g = 255;
            r = Math.round(510 - 5.10 * speed);
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);


    }

    getPolyline = (route) => {
        const arr = [];
        console.log(route)
        let lastRoute = route[1];
        for(let i=1; i < route.length-3; i += 5){
                arr.push(
                    <Polyline
                        geodesic={true}
                        options={{
                            path: [lastRoute, route[i]],
                            strokeColor: this.getColor(route[i].speed),
                            strokeOpacity: 1,
                            strokeWeight: 6,
                            icons: [{
                                offset: '0',
                                repeat: '10px'
                            }],
                        }}
                    />
                )
            lastRoute = route[i];
        }
        this.setState({
            polylines: arr,
            polylineReady: true,
        })
    }

    getData = () => {
        const that = this;
        axios.get('http://localhost:9999/data')
            .then(function (response) {
                console.log(response)
                that.setState({
                    route: response.data.coords,
                })
                that.getPolyline(response.data.coords)
            });
    }

  render() {
        console.log(this.state)
    return (
      <div className="App">
          {this.state.polylineReady && this.state.polylines && (
              <MyMapComponent
                  isMarkerShown={false}
                  route={this.state.route}
                  polylines={this.state.polylines}
                  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
              />
          )}
      </div>
    );
  }
}

export default App;
