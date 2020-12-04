import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotosListComponent } from './components/photos-list/photos-list.component'
import { PhotoUploadComponent } from './components/photo-upload/photo-upload.component'

const routes: Routes = [
  {
    path: 'photos',
    component: PhotosListComponent
  },
  {
    path: 'photos/new',
    component: PhotoUploadComponent
  },
  {
    path: '',
    redirectTo: '/photos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
