import { Component, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
//import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';

declare const require: any;
const mapsData = require('./usa.js');

//import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import {
  DxVectorMapComponent,
  DxVectorMapModule,
  DxButtonModule,
} from 'devextreme-angular';

//import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { Marker, Service } from './map.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-visit-usa',
  standalone: true,
  imports: [
    TablerIconsModule,
    MaterialModule,
    DxVectorMapModule,
    DxButtonModule,
  ],
  providers: [Service],
  templateUrl: './visit-usa.component.html',
})
export class AppVisitUsaComponent {
  @ViewChild(DxVectorMapComponent, { static: false })
  vectorMap: DxVectorMapComponent;
  world: any = mapsData.world;
  gdpData: Object;
  markers: Marker[];

  constructor(service: Service) {
    this.markers = service.getMarkers();
  }

  markerClick(e: any) {
    if (e.target && e.target.layer.type === 'marker') {
      e.component.center(e.target.coordinates()).zoomFactor(10);
    }
  }

  resetClick() {
    this.vectorMap.instance.center();
    this.vectorMap.instance.zoomFactor();
  }
}
