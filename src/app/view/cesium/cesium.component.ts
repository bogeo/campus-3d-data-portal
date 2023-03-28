import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ElementRef } from '@angular/core';
import { LayersService } from 'src/app/service/layers/layers.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cesium',
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss']
})
export class CesiumComponent implements OnInit {

  headers = new HttpHeaders()
    .set('content-encoding', 'gzip')

  constructor(private el: ElementRef) { }

  ngOnInit(): void {

    console.log(environment.accessToken);
    if (environment.accessToken) {
      Cesium.Ion.defaultAccessToken = environment.accessToken;
    }

    // let provider = new Cesium.CesiumTerrainProvider({
    //   url: '../../../assets/3d-models/terrain/terrain1',
    //   headers: this.headers
    // });

    // console.log(provider);

    const viewer = new Cesium.Viewer(this.el.nativeElement, {
      
      //Use Cesium World Terrain
      terrainProvider: Cesium.createWorldTerrain(),

      //Hide the base layer picker
      baseLayerPicker: true,
      // homeButton: false,
      geocoder: false,
      timeline: false,
      animation: false,
      fullscreenButton: false,
    });

    // viewer.terrainProvider = provider;

    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
    // bdom
    var tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: '../../../assets/3d-models/route1-no-g/tileset.json',
      })
    );



    tileset.style = new Cesium.Cesium3DTileStyle({
      pointSize: 2
    });
    viewer.zoomTo(tileset);

    viewer.extend(Cesium.viewerCesiumInspectorMixin);

    viewer.scene.canvas.addEventListener('mousemove', function (e) {
      var entity = viewer.entities.getById('mou');
      var ellipsoid = viewer.scene.globe.ellipsoid;
      // Mouse over the globe to see the cartographic position 
      var cartesian = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(e.clientX, e.clientY), ellipsoid);
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);
        entity.position = cartesian;

        var pointOfInterest = Cesium.Cartographic.fromDegrees(
          parseFloat(longitudeString), parseFloat(latitudeString));

        Cesium.sampleTerrain(viewer.terrainProvider, 9, [pointOfInterest])
          .then(function (samples) {
            var heightString = samples[0].height;
            console.log(samples[0].height);
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + ', ' + heightString + ')';
            var result = entity.label.text; // we can reuse this
            document.getElementById("demo").innerHTML = result;
          });



      } else {
        entity.label.show = false;
      }
    });



  }
}
