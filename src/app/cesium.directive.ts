import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { ElementRef } from '@angular/core';
import { Directive, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[appCesium]',
})
export class CesiumDirective implements OnInit {

  constructor(private el: ElementRef) {

  }

  ngOnInit() {

    if (environment.accessToken) {
      Cesium.Ion.defaultAccessToken = environment.accessToken;
    }

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

    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
    // bdom
    var tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: '../assets/3d-models/route1/tileset.json',

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