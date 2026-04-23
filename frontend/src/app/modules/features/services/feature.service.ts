import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { FeatureWithVersions,FeatureVersion,CreateFeatureRequest,RefineFeatureRequest } from "../models/feature.model";
import { AuthService } from "../../auth/services/auth.service";
@Injectable({
    providedIn:'root'
})
export class FeatureService{
    private apiUrl='https://localhost:7016/api/features';
    constructor(private http:HttpClient,private authService:AuthService){}
    private getHeaders():HttpHeaders{
        return new HttpHeaders({
            'X-User-Id':this.authService.getUserId()||''
        });
    }
    getFeaturesByProduct(productId:number):Observable<FeatureWithVersions[]>{
        return this.http.get<FeatureWithVersions[]>(`${this.apiUrl}/product/${productId}`,{
            headers:this.getHeaders()
        });
    }
    getFeatureById(featureId:number):Observable<FeatureWithVersions>{
        return this.http.get<FeatureWithVersions>(`${this.apiUrl}/${featureId}`,{
            headers:this.getHeaders()
        });
    }
    createFeature(payload:CreateFeatureRequest):Observable<FeatureVersion>{
        return this.http.post<FeatureVersion>(this.apiUrl,payload,{
            headers:this.getHeaders()
        });
    }
    refineFeature(payload:RefineFeatureRequest):Observable<FeatureVersion>{
        return this.http.post<FeatureVersion>(`${this.apiUrl}/refine`,payload,{
            headers:this.getHeaders()
        })
    }
     deleteFeature(featureId:number){
        return this.http.delete(`${this.apiUrl}/${featureId}`,{headers:this.getHeaders()});
     }
}
