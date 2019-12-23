import React, { useState, useEffect, useRef } from "react";

import { getBusesByService, getBusStops, getServices } from "../../dispatches";
import { ALL } from "./consts";
import Markers from "../markers";
import Map from "../map";
import Menu from "../menu";

const Container = <div style={{ height: `100vh` }} />;

const App = () => {
  const mapRef = useRef();
  const [buses, setBuses] = useState([]);
  const [stops, setStops] = useState([]);
  const [services, setServices] = useState([]);
  const [fleetNumberFilter, setFleetNumber] = useState(null);
  const [serviceFilter, setServiceFilter] = useState(ALL);

  useEffect(() => {
    getBusesByService(ALL, setBuses);
    getBusStops(setStops);
    getServices(setServices);
  }, []);

  const filteredBuses = buses.filter(bus => {
    if (fleetNumberFilter) {
      return bus.BusId === parseInt(fleetNumberFilter);
    }

    if (serviceFilter) {
      return bus.RefService === serviceFilter || serviceFilter === ALL;
    }

    return true;
  });

  useEffect(() => {
    if (fleetNumberFilter && filteredBuses.length === 1) {
      mapRef.current.panTo({
        lat: filteredBuses[0].Lat,
        lng: filteredBuses[0].Lon
      });
    }
  }, [fleetNumberFilter]);

  return (
    <div className="App">
      <Menu
        buses={filteredBuses}
        fleetNumberFilter={fleetNumberFilter}
        setFleetNumber={setFleetNumber}
        refresh={() => getBusesByService(ALL, setBuses)}
        services={services}
        setServiceNumber={setServiceFilter}
      />
      <Map
        mapRef={mapRef}
        googleMapURL={process.env.REACT_APP_MAP_API}
        loadingElement={Container}
        containerElement={Container}
        mapElement={Container}
      >
        <Markers buses={filteredBuses} stops={stops} />
      </Map>
    </div>
  );
};

export default App;