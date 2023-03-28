import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { restUrl } from 'src/environments/environment';
import { shareReplay} from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class DataService {



  data!: any;
  dataObs!: Observable<any>;


  url: string = restUrl + "pointclouds";
  


  constructor(private http: HttpClient) {
    this.dataObs = this.http.get(this.url).pipe(
      shareReplay(1)
    );
  }



  setData(data: any){
    this.data = data;
    console.log(this.data)
  }
}