export interface Feature{
    id:number;
    productId:number;
    title:string;
    rawIdea:string;
}
export interface FeatureVersion{
    id:number;
    featureId:number;
    versionNumber:number;
    content:string;
    created:string;
}
export interface FeatureWithVersions extends Feature{
    versions:FeatureVersion[];
}
export interface CreateFeatureRequest{
    title:string;
    rawIdea:string;
    productId:number;
}
export interface RefineFeatureRequest{
    featureId:number;
    refinementInstruction:string;
}