import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { PredictorComponent } from './predictor/predictor.component';
import { authGuard } from './auth/auth.guard';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'predictor', component: PredictorComponent, canActivate: [authGuard] },
  { path: 'prediction-result', component: ResultComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

