import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-measure-method',
  templateUrl: './measure-method.component.html',
  styleUrls: ['./measure-method.component.scss']
})

export class MeasureMethodComponent implements OnInit {

  @Output() measureMethod = 'ALS';


  constructor() { }

  ngOnInit(): void {
  }

  changeDropDownValue(obj:any){
    this.measureMethod = obj;
  }


}
