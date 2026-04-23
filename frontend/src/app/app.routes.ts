import { Routes } from '@angular/router';
import { authGuard } from './modules/auth/auth.guard';
export const routes: Routes = [
   {
    path:'',
    redirectTo:'auth',
    pathMatch:'full'
   },
   {
    path:'auth',
    loadComponent:()=>import('./modules/auth/auth.component').then(m=>m.AuthComponent)
   },
   {
    path:'app',
    canActivate:[authGuard],
    loadChildren:()=>
        import('./views/layout/layout.routes').then(m=>m.layoutroutes)
   }
];
