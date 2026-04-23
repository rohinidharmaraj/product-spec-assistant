import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { DashboardComponent } from "../../modules/dashboard/dashboard.component";
export const layoutroutes:Routes=[
    {
        path:'',
        component:LayoutComponent,
        children:[
            {
                path:'dashboard',
                loadComponent:()=>import('../../modules/dashboard/dashboard.component').then(m=>m.DashboardComponent)
            },
            {
                path:'products/:productId/features',
                loadComponent:()=>import('../../modules/features/features.component').then(m=>m.FeaturesComponent)
            },
           {
            path:'',
            redirectTo:'dashboard',
            pathMatch:'full'
           }
        ]
    }
]