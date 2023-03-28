import { Component, OnInit } from '@angular/core';


import { PcDataService } from 'src/app/service/pc-data.service';
// import * as internal from 'stream';

const pcDir = 'assets/raster/'

@Component({
  selector: 'app-pointclouds',
  templateUrl: './pointclouds.component.html',
  styleUrls: ['./pointclouds.component.scss']
})
export class PointcloudsComponent implements OnInit {

  status!:string;

  errorMessage: any;
  loading:boolean = false;
  data: any[] = [];
  filteredData: any[] = [];

  items: any[] = [];
  idFound: boolean = null;
  

  constructor(private pcDataService: PcDataService) { }

  ngOnInit(): void {
    this.loadData();
    this.refresh();
  }

  ngDoCheck(){
    this.refresh();
  }

  downloadFile(id:string) {
    console.log('request pointcloud ' + id)
    this.pcDataService.downloadPointcloud(id)
    .subscribe(
      blob => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = 'pointcloud_' + id + '.laz';
      a.click();
      URL.revokeObjectURL(objectUrl);
      }
  )
  }

  deleteFile(id:string){
    this.pcDataService.deletePointcloud(id)
    .subscribe(() => this.status = 'Delete successful');
  }

  switchLayerVisibility(clickedPc: any){

    let currentPointcloud = document.getElementById('my-pc' + clickedPc.id);


    // if layer is currently visible make it invisible
    if (currentPointcloud?.classList.contains('bi-eye')){
      currentPointcloud.classList.remove('bi-eye');
      currentPointcloud.classList.add('bi-eye-slash');
      this.pcDataService.layers.forEach(layer => {
        if(layer.options.layers == clickedPc.rasterLayerName){
          let newMap = this.pcDataService.map.removeLayer(layer);
          this.pcDataService.changeMap(newMap);
        }
        
      });
    }

    // if layer is currently invisible make it visible
    else if (currentPointcloud?.classList.contains('bi-eye-slash')){
      currentPointcloud.classList.remove('bi-eye-slash');
      currentPointcloud.classList.add('bi-eye');
      this.pcDataService.layers.forEach(layer => {
        if(layer.options.layers == clickedPc.rasterLayerName){
          let newMap = this.pcDataService.map.addLayer(layer);
          this.pcDataService.changeMap(newMap);
        }
        
      });
    }



    // let layer = this.initGetService.layers[0];
    // console.log(this.initGetService.layers)


  }

  loadData(){
    this.loading = true;
    this.errorMessage = "";
    this.pcDataService.getInitData()
      .subscribe(
        (response) => {
          console.log('response received')
          // console.log(response)
          // console.log(response.pointclouds[0])
          for (const pc of response.pointclouds) {
            pc['isCollapsed'] = true;
            this.data.push(pc);
          }
          this.pcDataService.setData(this.data)
          this.filteredData = this.data
          
          //  = response;
          // console.log(this.data)
        },
        (error) =>{
          // console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        },
        () => {
          // console.error('Request completed')
          this.loading = false;
        }
      )
  }

  copyMessage(val:any){
    const selBox = document.createElement('textarea');
    // selBox.style.position = 'fixed';
    // selBox.style.left = '0';
    // selBox.style.top = '0';
    // selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  refresh(){
    // this.idFound = false;
    this.filteredData = this.pcDataService.searchedPointclouds;
    this.items = [];
    // console.log(this.data);
    // console.log(this.pcDataService.searchedId);
    // this.data.forEach(
      this.filteredData.forEach(
      item => {
        this.items.push(item)
        // if(item.name.search(this.keyword) != -1
        //  || item.age.search(this.keyword) != -1 
        //  || item.post.search(this.keyword) != -1) {
        //   this.items.push(item)
        // }


        // if(this.pcDataService.searchedId != null && this.pcDataService.searchedId != ""){
        //   console.log("is " + item.id + " = " + this.pcDataService.searchedId + "?")
        //   if(this.pcDataService.searchedId.includes(item.id.toString()) == true) {
        //     this.items.push(item);
            
        //   }
        //   if(this.items.length > 0){
        //     this.idFound = true;
        //   }
        //   else{
        //     this.idFound = false;
        //   }          
        // }
        // else{
        //   this.idFound = null;
        // }
      }
    ) 
  }

}
