import { Injectable } from '@angular/core';

export class Attributes {
  name: string;
}

export class Marker {
  coordinates: number[];

  attributes: Attributes;
}

const markers: Marker[] = [
  {
    coordinates: [-118.245003, 34.053501],
    attributes: {
      name: 'Los Angeles',
    },
  },
  {
    coordinates: [-74.007118, 40.71455],
    attributes: {
      name: 'New York',
    },
  },
  {
    coordinates: [-84.423058, 33.763191],
    attributes: {
      name: 'Atlanta',
    },
  },
  {
    coordinates: [-87.632408, 41.884151],
    attributes: {
      name: 'Chicago',
    },
  },
];

@Injectable()
export class Service {
  getMarkers(): Marker[] {
    return markers;
  }
}
