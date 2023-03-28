import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.tilelayer.colorfilter'
import { PcDataService } from 'src/app/service/pc-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit {

  private rasterLayers: string[] = [];
  private map: L.Map = this.pcDataService.map;
  public layers: any;

  errorMessage: any;
  loading:boolean = false;
  // data!: newPcMetadata[];

  constructor(private pcDataService: PcDataService) {
    this.loadData();
   }

  private initMap(): void {


    var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    var osmAttr = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    var grayScaleFilter = ["grayscale: 100%"]

    var osmMap = L.tileLayer.colorFilter(osmUrl, {attribution: osmAttr, filter: grayScaleFilter});

    let newMap = L.map('map', {
      layers: [osmMap] 
    }).setView([51.447437, 7.271786], 17);

  // base_layer = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr})


    var baseLayers = {
      "OpenStreetMap": osmMap
    };

  // const tiles = L.tileLayer(osm, {
  //   maxZoom: 18,
  //   minZoom: 3,
  //   attribution: osmAttr
  // });

  // tiles.addTo(newMap);
  
  // console.log(newMap)
  L.control.layers(baseLayers).addTo(newMap);

  this.loadRaster(newMap);

  this.pcDataService.changeMap(newMap);
  
}

loadRaster(map: L.Map){

  let wmsURL = "http://map.campus3d.hs-bochum.de:8000/geoserver/campus-3d-dems/wms?"
  // console.log(this.rasterLayers);
  for(var i=0; i<this.rasterLayers.length; i++){
    let wmsOptions = {
      layers: this.rasterLayers[i],
      format: 'image/png',
      transparent: true
    }
    const layer = L.tileLayer.wms(wmsURL, wmsOptions);
    // console.log(layer)
    // map.addLayer(layer)
    this.pcDataService.addLayer(layer);
  }

}

showRaster(raster: any){
  console.log(raster)
  this.map.addLayer(raster)
}


  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    
  }

  loadData(){
    this.loading = true;
    this.errorMessage = "";
    this.pcDataService.getInitData()
      .subscribe(
        (response) => {
          console.log('response received');
          response.pointclouds.forEach((pointcloud: { rasterLayerName: string; })=> {
            // console.log(pointcloud.rasterLayerName);
            this.rasterLayers.push(pointcloud.rasterLayerName);
          });
          // console.log(this.rasterLayers);
          this.initMap();
        },
        (error) =>{
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {
          console.error('Request completed')
          this.loading = false;
        }
      )
  }
}