// import { Component, OnInit, ViewChild } from '@angular/core';
// import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// import { Observable, OperatorFunction, Subject } from 'rxjs';
// import { debounceTime } from 'rxjs/operators';

import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { PcDataService } from 'src/app/service/pc-data.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {


  data: any[] = [];
  pointcloudIds: any[] = [];

  filteredData: any[] = [];
  filteredId: any;
  filteredDate: any[] = [];
  filteredDateString: any[] = [];
  filteredAttributeFields: any[] = [];
  filteredAccuracy: any = { "position": "", "height": "" };

  // filteredPc = Array();

  @Output() measureMethod = 'Alle';

  constructor(private pcDataService: PcDataService) {
  }

  // pointcloudIds = this.pcDataService;



  ngOnInit(): void {
    this.loadData();
    this.filterData();
  }

  loadData() {
    this.pcDataService.getInitData()
      .subscribe(
        (response) => {
          console.log('response received')
          for (const pc of response.pointclouds) {
            pc['isCollapsed'] = true;
            this.data.push(pc);
            this.pointcloudIds.push(pc.id);
          }
          this.pcDataService.setData(this.data)
        },
        (error) => {
        },
        () => {
        }
      )
  }

  @Output() emitter: EventEmitter<string>
    = new EventEmitter<string>();

  emitId(e) {
    // this.emitter.emit(keyword);
    this.filteredId = (e.target as HTMLTextAreaElement).value
    this.filterData();

  }

  receiveAttributeFields() {

    this.filteredAttributeFields = [];

    let rgb = (<HTMLInputElement>document.getElementById("checkRgb"));
    let intensity = (<HTMLInputElement>document.getElementById("checkIntensity"))
    let other = (<HTMLInputElement>document.getElementById("checkOther"))

    if (rgb.checked) {
      this.filteredAttributeFields.push(rgb.value);
    }
    if (intensity.checked) {
      this.filteredAttributeFields.push(intensity.value);
    }
    if (other.checked) {
      this.filteredAttributeFields.push(other.value);
    }

    this.filterData();

  }

  emitAccuracyPosition(e) {
    let value = (e.target as HTMLTextAreaElement).value;
    this.filteredAccuracy.position = value
    this.filterData();
  }

  emitAccuracyHeight(e) {
    let value = (e.target as HTMLTextAreaElement).value;
    this.filteredAccuracy.height = value
    this.filterData();
  }

  receiveDate($event: string[]) {

    if ($event.length == 1) {

      this.filteredDate = [stringToDate($event[0])];
      this.filteredDateString = [$event[0]]

    }

    if ($event.length == 2) {

      this.filteredDate = [stringToDate($event[0]), stringToDate($event[1])];
      this.filteredDateString = [$event[0], $event[1]]

    }

    this.filterData();
  }




  emitMeasureMethod(obj: any) {
    this.measureMethod = obj;
    this.filterData();
  }

  filterData() {

    let filteredPc: any[] = [];
    let allPcs = this.data;

    let id = this.filteredId
    let measureMethod = this.measureMethod;
    let accuracy = this.filteredAccuracy;
    let attributeFields = this.filteredAttributeFields;
    let measureDate = this.filteredDate;

    console.log('filter data')

    // no filter set
    if (id == null) {
      if (measureMethod == 'Alle' && accuracy.position == '' && accuracy.height == '' && attributeFields.length == 0 && measureDate.length == 0) {
        this.pcDataService.setSearchedPointclods(allPcs)
      }
      this.filterMeasureMethod(measureMethod, filteredPc, allPcs)
      this.filterAccuracy(accuracy, filteredPc, allPcs)
      this.filterAttributeFields(attributeFields, filteredPc, allPcs)
      this.filterMeasureDate(measureDate, filteredPc, allPcs)
    }

    else {
      if (id.length == 0 && measureMethod == 'Alle' && accuracy.position == '' && accuracy.height == '' && attributeFields.length == 0 && measureDate.length == 0) {
        this.pcDataService.setSearchedPointclods(allPcs);
      }

      this.filterId(id, filteredPc, allPcs)
      this.filterMeasureMethod(measureMethod, filteredPc, allPcs)
      this.filterAccuracy(accuracy, filteredPc, allPcs)
      this.filterAttributeFields(attributeFields, filteredPc, allPcs)
      this.filterMeasureDate(measureDate, filteredPc, allPcs)
    }

    if (filteredPc.length > 0) {
      this.pcDataService.setSearchedPointclods(filteredPc[filteredPc.length - 1])
    }


    console.log('end filter')

  }

  filterId(id, filteredPc, allPcs) {
    if (id.length > 0) {
      if (filteredPc.length == 0) {
        filteredPc.push(allPcs.filter(function (pc) {
          return pc['id'] == id
        }))
      }
      else {
        filteredPc.push(filteredPc.filter(function (pc) {
          return pc['id'] == id
        }))
      }
    }
  }

  filterMeasureMethod(measureMethod, filteredPc, allPcs) {
    if (measureMethod != 'Alle') {
      if (filteredPc.length == 0) {
        filteredPc.push(allPcs.filter(function (pc) {
          return pc['measureMethod'] == measureMethod
        }))
      }
      else {
        let newFilter: any[] = []
        newFilter.push(filteredPc[filteredPc.length - 1].filter(function (pc) {
          return pc['measureMethod'] == measureMethod
        }))
        filteredPc = newFilter
      }
    }
  }

  filterAccuracy(accuracy, filteredPc, allPcs) {
    if (accuracy.position != '' && accuracy.height != '') {
      if (filteredPc.length == 0) {
        filteredPc.push(allPcs.filter(function (pc) {
          return pc['accuracy']['position'] == accuracy.position &&
            pc['accuracy']['height'] == accuracy.height
        }))
      }
      else {
        let newFilter: any[] = []
        newFilter.push(filteredPc[filteredPc.length - 1].filter(function (pc) {
          return pc['accuracy']['position'] == accuracy.position,
            pc['accuracy']['height'] == accuracy.height
        }))
        filteredPc = newFilter
      }
    }
  }

  filterAttributeFields(attributeFields, filteredPc, allPcs) {
    if (attributeFields.length > 0) {
      if (filteredPc.length == 0) {
        filteredPc.push(allPcs.filter(function (pc) {
          return pc['attributeFields'].some(attrField => attributeFields.includes(attrField))
        }))
      }
      else {
        let newFilter: any[] = []
        newFilter.push(filteredPc[filteredPc.length - 1].filter(function (pc) {
          return pc['attributeFields'].some(attrField => attributeFields.includes(attrField))
        }))
        filteredPc = newFilter
      }
    }

  }

  filterMeasureDate(measureDate, filteredPc, allPcs) {
    if (measureDate.length == 2) {
      if (filteredPc.length == 0) {
        filteredPc.push(allPcs.filter(function (pc) {
          return stringToDate(pc['measureDate']['startDate']) > measureDate[0] &&
            stringToDate(pc['measureDate']['endDate']) > measureDate[0] &&
            stringToDate(pc['measureDate']['startDate']) < measureDate[1] &&
            stringToDate(pc['measureDate']['endDate']) < measureDate[1]
        }))
        console.log(filteredPc)
      }
      else {
        let newFilter: any[] = []
        newFilter.push(filteredPc[filteredPc.length - 1].filter(function (pc) {

          return stringToDate(pc['measureDate']['startDate']) > measureDate[0] &&
            stringToDate(pc['measureDate']['endDate']) > measureDate[0] &&
            stringToDate(pc['measureDate']['startDate']) < measureDate[1] &&
            stringToDate(pc['measureDate']['endDate']) < measureDate[1]

        }))
        filteredPc = newFilter
        console.log(filteredPc)
      }
    }
  }
}

function stringToDate(dateString: string) {
  let day = dateString.split('-')[2]
  let month = dateString.split('-')[1]
  let year = dateString.split('-')[0]
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}