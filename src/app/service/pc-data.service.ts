import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { restUrl } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class PcDataService {

  map!: L.Map;
  data!: any;
  layers: any[] = [];
  searchedId: string;

  searchedPointclouds: any[] = []


  url: string = restUrl + "pointclouds";
  // dataObs!: Observable<any>;

  constructor(private http: HttpClient) {
    // this.dataObs = this.http.get(this.url).pipe(
    //   shareReplay(1)
    // );
  }

  getInitData(): Observable<any>{
    return this.http.get(this.url)
  }

  addPointcloud(formData: FormData): Observable<any> {

    return this.http.post<any>(this.url, formData);
  }

  downloadPointcloud(id:string){
    console.log(this.url + '/' + id)
    return this.http.get(this.url + '/' + id, {
      responseType: "blob",
    });
  }

  deletePointcloud(id:string){
    return this.http.delete(this.url + '/' + id)
  }

  setData(data: any){
    this.data = data;
    console.log(this.data)
  }

  changeMap(map: L.Map) {
    this.map = map;
  }

  addLayer(layer: any) {
    this.layers.push(layer);
  }

  setSearchedId(id: string){
    this.searchedId = id;
  }

  setSearchedPointclods(searchedPointclouds: any[]){
    this.searchedPointclouds = searchedPointclouds;
  }
}
