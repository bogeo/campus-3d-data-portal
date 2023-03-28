import { Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { PcDataService } from 'src/app/service/pc-data.service';

import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, merge, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';


const epsgPosition = ['25832', '4326', '4647']
const epsgHeight = ['7837', '57832']
const test = ['7837', '57832']



@Component({
  providers: [DateRangePickerComponent],
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})



export class UploadComponent implements OnInit {

  model:any

  public isCollapsed = true;
  closeResult = '';
  fileToUpload: File | null = null;
  date: string[];
  file:any;

  constructor(private modalService: NgbModal, private dataService: PcDataService) {}

  ngOnInit(): void {
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openUploadMask(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  uploadFile(){
    let jsonObject = this.generateJsonObject();
    console.log(jsonObject);

    let formData = new FormData();
    let id = this.generateId();

    // console.log(this.file);
    // console.log(jsonObject);
    // console.log(id);


    formData.append("file", this.file, this.file.name);
    formData.append("metadata", jsonObject);
    formData.append("pointcloudId", id.toString());
 

    this.dataService.addPointcloud(formData)
    // this.http.post<any>(config.restUrl, formData)
      .subscribe(
        data => console.log('success'),
        error => console.log(error)
      )
  }

  receiveDate($event:string[]){
    this.date = $event;
  }

  generateJsonObject(){

    // accuracy
    let accPosition = parseInt((<HTMLInputElement>document.getElementById("acc-position-input")).value);
    let accHeight = parseInt((<HTMLInputElement>document.getElementById("acc-height-input")).value);

    let accuracy = {
      "position": accPosition,
      "height": accHeight
    };


    // expression
    let expressionKind: string = '';
    let expressionKinds = (<HTMLInputElement>document.getElementById("expression-kind")).children;
    let expressionKindRegular = expressionKinds.item(0);
    let expressionKindIrregular = expressionKinds.item(1);
    
    if(expressionKindRegular != null && expressionKindRegular.classList.contains('active')){
      expressionKind = 'regular';
    }
    if(expressionKindIrregular != null && expressionKindIrregular.classList.contains('active')){
      expressionKind = 'irregular';
    }
    
    let pointDenseMin = parseInt((<HTMLInputElement>document.getElementById("point-dense-min-input")).value);
    let pointDenseMax = parseInt((<HTMLInputElement>document.getElementById("point-dense-max-input")).value);

    let expression = {
      "kind": expressionKind,
      "pointDense": {
        "min": pointDenseMin,
        "max": pointDenseMax
      }
    }

    // measure method
    let measureMethod = (<HTMLButtonElement>document.getElementById("measure-method-btn")).innerText;
    console.log(<HTMLButtonElement>document.getElementById("measure-method-btn"));
    
    // measure date
    let measureDate;

    if (this.date.length > 1){
      console.log(this.date[0]);
      if(this.date[0].length == 1){
        this.date[0] = "0" + this.date[0];
        console.log(this.date[0]);
      }


      measureDate = {
        "startDate": this.date[0],
        "endDate": this.date[1]
      }
    }
    else{
      measureDate = {
        "startDate": this.date[0],
        "endDate": this.date[0]
      }
    }


    // data source
    let institution = (<HTMLInputElement>document.getElementById("institution-input")).value;
    let name = (<HTMLInputElement>document.getElementById("name-input")).value;
    let street = (<HTMLInputElement>document.getElementById("street-input")).value;
    let hno = (<HTMLInputElement>document.getElementById("hno-input")).value;
    let zip = (<HTMLInputElement>document.getElementById("zip-input")).value;
    let country = (<HTMLInputElement>document.getElementById("country-input")).value;
    let mail = (<HTMLInputElement>document.getElementById("mail-input")).value;

    let dataSource = {
      "institution": institution,
      "name": name,
      "address":{
        "street": street,
        "hno": hno,
        "zipCode": zip,
        "country": country
      },
      "mail": mail
      }

    // attribute fields
    let attributeFields = [];

    let rgb = (<HTMLInputElement>document.getElementById("flexCheckRgb"));
    let intensity = (<HTMLInputElement>document.getElementById("flexCheckIntensity"))
    let other = (<HTMLInputElement>document.getElementById("flexCheckOther"))
    
    if(rgb.checked){
      attributeFields.push(rgb.value);
    }
    if(intensity.checked){
      attributeFields.push(intensity.value);
    }
    if(other.checked){
      attributeFields.push(other.value);
    }

    // freetext
    let freetext = (<HTMLInputElement>document.getElementById("freetext-input")).value; 

    // projection
    let projPosition = (<HTMLInputElement>document.getElementById("proj-position-input")).value;
    let projHeight = (<HTMLInputElement>document.getElementById("proj-height-input")).value;

    let projection = {
      "position": projPosition,
      "height": projHeight
    };

    // license
    let license = (<HTMLInputElement>document.getElementById("license-input")).value; 

    // merge metadate to one jsonobject

    let jsonObj = JSON.stringify({

      "accuracy": accuracy,
      "expression": expression,
      "measureMethod": measureMethod,
      "measureDate": measureDate,
      "dataSource": dataSource,
      "attributeFields": attributeFields,
      "freeText": freetext,
      "projection": projection,
      "license": license,
      "boundary": ""
    })

    return jsonObj;
  }

  handleFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    this.file = fileList?.item(0);
    console.log(this.file.name)
  }

  generateId() {
    let newId!: number;

    for (let i = 0; i < this.dataService.data.length +1; i++) {
      console.log(this.dataService.data[0].id)
      if(i + 1 != this.dataService.data[i].id){
        newId = i + 1;
        return newId;
      }
      
    }

    return ErrorEvent;

  }

  @ViewChild('instancePos', {static: true}) instance: NgbTypeahead;
  focusP$ = new Subject<string>();
  clickP$ = new Subject<string>();

  searchP: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickP$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusP$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? epsgPosition
        : epsgPosition.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  @ViewChild('instanceHeight', {static: true}) instanceH: NgbTypeahead;
  focusH$ = new Subject<string>();
  clickH$ = new Subject<string>();

  searchH: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickH$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusH$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? epsgHeight
        : epsgHeight.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
  


}

