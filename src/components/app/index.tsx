import React, { Fragment, useState, useEffect, useRef } from "react";

import { getBusesByService, getBusStops, getServices } from "../../dispatches";
import { filterFleet, filterType } from "../../helpers";
import { ALL } from "../../consts";
import Markers from "../markers";
import Map from "../map";
import Menu from "../menu";
import { Bus, MapType, Stop, Service } from "../../types";

const App = () => {
  const mapRef = useRef<MapType>();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [fleetNumberFilter, setFleetNumber] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>(ALL);
  const [showOutOfService, setShowOutOfService] = useState<boolean>(true);

  useEffect(() => {
    getBusesByService(ALL, setBuses);
    getBusStops(setStops);
    getServices(setServices);
  }, []);

  const filteredBuses = buses.filter((bus: Bus): boolean => {
    if (fleetNumberFilter) {
      return filterFleet(bus, fleetNumberFilter);
    }

    if (!showOutOfService && !bus.RefService) {
      return false;
    }

    if (typeFilter !== ALL) {
      return filterType(bus, typeFilter);
    }

    if (serviceFilter !== ALL) {
      return bus.RefService === serviceFilter;
    }

    return true;
  });

  useEffect(() => {
    if (fleetNumberFilter && filteredBuses.length === 1 && mapRef.current) {
      mapRef.current.panTo({
        lat: filteredBuses[0].Lat,
        lng: filteredBuses[0].Lon,
      });
    }
  }, [fleetNumberFilter]);

  return (
    <Fragment>
      <Menu
        buses={filteredBuses}
        fleetNumberFilter={fleetNumberFilter}
        refresh={() => getBusesByService(ALL, setBuses)}
        serviceFilter={serviceFilter}
        services={services}
        setFleetNumber={setFleetNumber}
        setServiceNumber={setServiceFilter}
        setShowOutOfService={setShowOutOfService}
        setTypeFilter={setTypeFilter}
        showOutOfService={showOutOfService}
        typeFilter={typeFilter}
      />
      <Map mapRef={mapRef}>
        <Markers buses={filteredBuses} stops={stops} />
      </Map>
    </Fragment>
  );
};

export default App;
