import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,NgForm } from '@angular/forms';
import { FeatureService } from './services/feature.service';
import { ProductService } from '../products/product.service';
import { AuthService } from '../auth/services/auth.service';
import { FeatureVersion,FeatureWithVersions } from './models/feature.model';
import { Product } from '../products/product.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-features',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent implements OnInit {
 
  product: Product | null = null;
  features: FeatureWithVersions[] = [];
  selectedFeature: FeatureWithVersions | null = null;
  selectedVersion: FeatureVersion | null = null;
 
  featureTitle = '';
  rawIdea = '';
  generateLoading = false;
  generateError = '';
  refinementInstruction = '';
  refineLoading = false;
 
  showForm = false;
 
  productId = 0;
  userId = 0;
  
  userEmail=localStorage.getItem('userEmail') || '';
  constructor(
    private route: ActivatedRoute,
    private featureService: FeatureService,
    private productService: ProductService,
    private authService: AuthService
  ) {}
 
 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.productId = Number(params.get('productId'));
    this.userId = Number(this.authService.getUserId());

    this.features = [];
    this.product = null;
    this.showForm = false;
 
    this.productService.getProductById(this.productId).subscribe({
      next: (p) => this.product = p
    });
 
    this.featureService.getFeaturesByProduct(this.productId).subscribe({
      next: (data) => {
        this.features = data;
 
        if (data.length > 0) {
          this.selectFeature(data[0]);
        } else {
          this.showForm = true;
        }
      }
    });
  });
}
 
  selectFeature(feature: FeatureWithVersions): void {
    this.selectedFeature = feature;
    this.showForm = false;
    this.featureTitle = feature.title;
    this.rawIdea = feature.rawIdea;
    this.generateError = '';
    this.selectedVersion = feature.versions?.length > 0
      ? feature.versions[feature.versions.length - 1]
      : null;
  }
 
  selectVersion(version: FeatureVersion): void {
    this.selectedVersion = version;
  }
 
  openNewFeatureForm(): void {
    this.selectedFeature = null;
    this.selectedVersion = null;
    this.featureTitle = '';
    this.rawIdea = '';
    this.generateError = '';
    this.showForm = true;
  }
 
  onGenerateSpec(form: NgForm): void {
    if (form.invalid) return;
    this.generateLoading = true;
    this.generateError = '';
 
    this.featureService.createFeature({
      title: this.featureTitle,
      rawIdea: this.rawIdea,
      productId: this.productId
    }).subscribe({
      next: (version) => {
        this.generateLoading = false;
        this.featureService.getFeaturesByProduct(this.productId).subscribe({
          next: (data) => {
            this.features = data;
            const newFeature = data.find(f => f.id === version.featureId);
            if (newFeature) {
              this.selectFeature(newFeature);
              this.selectedVersion = version;
            }
          }
        });
      },
      error: () => {
        this.generateLoading = false;
        this.generateError = 'Something went wrong! Try again!!!';
      }
    });
  }
 
  onRefine(): void {
    if (!this.refinementInstruction.trim() || !this.selectedFeature) return;
    this.refineLoading = true;
 
    this.featureService.refineFeature({
      featureId: this.selectedFeature.id,
      refinementInstruction: this.refinementInstruction
    }).subscribe({
      next: (newVersion) => {
        this.refineLoading = false;
        this.refinementInstruction = '';
        this.selectedFeature!.versions.push(newVersion);
        this.selectedVersion = newVersion;
      },
      error: () => {
        this.refineLoading = false;
      }
    });
  }
  logout():void{
    this.authService.logout();
  }
 
formatContent(content: string): { heading: string; body: string[] }[] {
  if (!content) return [];
 
  const result: { heading: string; body: string[] }[] = [];
  const sections = content.split(/(?=\d+\.)/).filter(s => s.trim());
 
  for (const section of sections) { 
    const match = section.match(/^(\d+\.\w+(?:\s\w+)?)\s+([\s\S]+)$/);
    if (!match) continue;
 
    const heading = match[1].trim();
    const bodyRaw = match[2].trim();
    const headingLower = heading.toLowerCase();
 
    let bodyLines: string[];
 
    if (bodyRaw.includes('As a') || bodyRaw.includes('As an')) {
      bodyLines = bodyRaw.split(/(?=As a|As an)/).map(s => s.trim()).filter(Boolean);
    } else if (headingLower.includes('acceptance') || headingLower.includes('edge') || headingLower.includes('metric')) {
      bodyLines = bodyRaw.split(/(?<=\.)\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
    } else {
      bodyLines = [bodyRaw];
    }
 
    result.push({ heading, body: bodyLines });
  }
 
  return result;
}
exportPdf() {
  const element = document.getElementById('spec-print-area')!;
  
  html2canvas(element).then(canvas => {
    const pdf = new jsPDF();
    const img = canvas.toDataURL('image/png');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, width, height);
    pdf.save('spec.pdf');
  });
}
selectAndPrint(version: any, event: Event) {
  event.stopPropagation();
  this.selectedVersion = version;
  setTimeout(() => this.exportPdf(), 300);
}
deleteFeature(featureId: number, event: Event) {
  event.stopPropagation();
 
  const confirmDelete = confirm('Delete this feature?');
  if (!confirmDelete) return;
 
  this.featureService.deleteFeature(featureId).subscribe({
    next: () => {
      this.features = this.features.filter(f => f.id !== featureId);
      if (this.selectedFeature?.id === featureId) {
        this.selectedFeature = null;
      }
    },
    error: (err) => {
      console.error('Delete failed!!!', err);
      alert('Failed to delete feature!!!');
    }
  });
}

}
 