import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  effect,
  signal,
  ViewChild
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMap, MapInfoWindow, MapMarker, MapPolygon, MapPolyline } from '@angular/google-maps';
import { IMapMarker } from './interfaces/branch-marker-map.interface';
import { NgForOf } from '@angular/common';
import { HexagonService } from './services/hexagon.service';
import geojson2h3 from 'geojson2h3';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GoogleMap,
    MapInfoWindow,
    MapMarker,
    MapPolygon,
    NgForOf,
    MapPolyline
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'angular-hexagon-test';
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  branches = signal<any[]>([]);
  center: google.maps.LatLngLiteral = { lat: 46.8182, lng: 8.2275 };
  zoom = 8;
  markers: IMapMarker[] = [];

  constructor(private hexagonService: HexagonService) {
    effect(
      () => {
        // Assign markers to data
        this.markers = this.getMarkers();
      },
      { allowSignalWrites: true }
    );
  }

  ngAfterViewInit(): void {
    this.getHexagons();
    // this.map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json',{idPropertyName:'asdf'});
    this.map.data.loadGeoJson('data.json');
    // this.map.data.loadGeoJson('http://localhost:4200/data.json',{idPropertyName:'asdf'});
  }

  getMarkers() {
    return this.branches()
      .map((branch) => {
        const marker: IMapMarker = {
          label: '',
          position: { lat: branch.lat, lng: branch.lng },
          title: branch.name,
          options: { animation: google.maps.Animation.DROP },
          branch: branch
        };
        return marker;
      })
      .filter(
        (marker) => !isNaN(marker.position.lat) && !isNaN(marker.position.lng)
      );
  }


  getHexagons() {
    this.hexagonService.getHexagon().subscribe(val => {
      console.log(val);
      let result = [];
      try {
        result = geojson2h3.featureToH3Set(val as any, 5);
        console.log(result);
        // const feature = geojson2h3.h3SetToFeatureCollection(result);
        // console.log(feature);
        // this.map.data.addGeoJson(feature);
      } catch (err) {
        console.log(err);
      }
    });
  }

  openInfoWindow(branch: any, marker: MapMarker): void {
    // this.selectedBranch.set(branch);
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }
}
