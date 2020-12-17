import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotosListComponent } from './components/photos-list/photos-list.component'
import { PhotoUploadComponent } from './components/photo-upload/photo-upload.component'
import { PhotoDetailComponent } from './components/photo-detail/photo-detail.component'
import { PhotoBulkLoadComponent } from './components/photo-bulk-load/photo-bulk-load.component';
import { BulkSelectComponent } from './components/bulk-select/bulk-select.component';

const routes: Routes = [
  {
    path: 'photos',
    component: PhotoDetailComponent
  },
  {
    path: 'photos/new',
    component: PhotoUploadComponent
  },
  {
    path: 'photos/:id',
    component: PhotoDetailComponent
  },
  {
    path: 'blukLoad',
    component: PhotoBulkLoadComponent
  },
  {
    path: 'blukLoad/:id',
    component: BulkSelectComponent
  },
  {
    path: 'allPhotos',
    component: PhotosListComponent
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
