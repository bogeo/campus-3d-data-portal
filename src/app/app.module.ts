import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CesiumDirective } from './cesium.directive';
import { CesiumComponent } from './view/cesium/cesium.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewComponent } from './view/view.component';
import { ButtonsComponent } from './sidebar/buttons/buttons.component';
import { FilterComponent } from './sidebar/filter/filter.component';
import { PointcloudsComponent } from './sidebar/pointclouds/pointclouds.component';
import { MapComponent } from './view/map/map.component';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './sidebar/buttons/upload/upload.component';
import { AttributeFieldsComponent } from './sidebar/buttons/upload/attribute-fields/attribute-fields.component';
import { DataSourceComponent } from './sidebar/buttons/upload/data-source/data-source.component';
import { ExpressionComponent } from './sidebar/buttons/upload/expression/expression.component';
import { MeasureMethodComponent } from './sidebar/buttons/upload/measure-method/measure-method.component';
import { DateRangePickerComponent } from './sidebar/buttons/upload/date-range-picker/date-range-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    CesiumDirective,
    CesiumComponent,
    HeaderComponent,
    SidebarComponent,
    ViewComponent,
    ButtonsComponent,
    FilterComponent,
    PointcloudsComponent,
    MapComponent,
    UploadComponent,
    AttributeFieldsComponent,
    DataSourceComponent,
    ExpressionComponent,
    MeasureMethodComponent,
    DateRangePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
