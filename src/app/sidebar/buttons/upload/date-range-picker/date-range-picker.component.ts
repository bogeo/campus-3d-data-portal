import { Component, OnInit, Output } from '@angular/core';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {

  ngOnInit(): void {
  }

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | undefined;
  toDate: NgbDate | null = null;

  @Output() messageEvent = new EventEmitter();

  maxPickerDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
};

  constructor() {
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
      
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  public getDate(): any{
    let dates: NgbDate[] | undefined;
    if(this.fromDate != null && this.toDate != null){
      let dates: NgbDate[] = [this.fromDate, this.toDate];
    }
    return dates;
  }

  public sendDate(){
    window.setTimeout(() =>{
      let dates: any;
      let month = this.fromDate?.month;
      let day = this.fromDate?.day;
      let monthString;
      let dayString;
      let fromDateString;
      let toDateString;
      if(month != undefined && day != undefined){
        monthString = this.convertDateToString(month);
        dayString = this.convertDateToString(day);
        fromDateString = this.fromDate?.year + '-' + monthString + '-' + dayString;
      }

      if(this.toDate != undefined){
        month = this.toDate.month;
        day = this.toDate.day;

        if(month != undefined && day != undefined){
          monthString = this.convertDateToString(month);
          dayString = this.convertDateToString(day);
          toDateString = this.toDate?.year + '-' + monthString + '-' + dayString;
        }

        
        dates = [fromDateString, toDateString];
        
      }
      else{
        dates = [fromDateString];
      }
      this.messageEvent.emit(dates);
    },
    1000
    );
    
  }

  convertDateToString(date: number):string{
    if(date < 10){
      return "0" + date;
    }
    else{
      return date.toString();
    }
  }
}
