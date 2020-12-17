import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhotosListComponent } from './components/photos-list/photos-list.component';
import { PhotoUploadComponent } from './components/photo-upload/photo-upload.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { PhotoDetailComponent } from './components/photo-detail/photo-detail.component';
import { PhotoBulkLoadComponent } from './components/photo-bulk-load/photo-bulk-load.component';
import { BulkSelectComponent } from './components/bulk-select/bulk-select.component';

@NgModule({
  declarations: [
    AppComponent,
    PhotosListComponent,
    PhotoUploadComponent,
    NavigationBarComponent,
    PhotoDetailComponent,
    PhotoBulkLoadComponent,
    BulkSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
