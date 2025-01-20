import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './auth/register/register.component';
import { PredictorComponent } from './predictor/predictor.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ResultComponent } from './result/result.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    PredictorComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }