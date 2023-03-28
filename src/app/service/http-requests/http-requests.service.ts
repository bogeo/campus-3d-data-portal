import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { restUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  url: string = restUrl + "pointclouds";

  // constructor(private http: HttpClient) {
  //   this.dataObs = this.http.get(this.url).pipe(
  //     shareReplay(1)
  //   );
  // }

  // getInitData(): Observable<any>{
  //   return this.http.get(this.url)
  // }

  // addPointcloud(formData: FormData): Observable<any> {
  //   return this.http.post<any>(this.url, formData);
  // }

  // downloadPointcloud(id:string){
  //   console.log(this.url + '/' + id)
  //   return this.http.get(this.url + '/' + id, {
  //     responseType: "blob",
  //   });
  // }

  // deletePointcloud(id:string){
  //   return this.http.delete(this.url + '/' + id)
  // }
}
