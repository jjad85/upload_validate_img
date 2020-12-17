import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service'
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'

@Component({
  selector: 'app-photo-bulk-load',
  templateUrl: './photo-bulk-load.component.html',
  styleUrls: ['./photo-bulk-load.component.css']
})
export class PhotoBulkLoadComponent implements OnInit {

  selectedFiles: FileList;
  progressInfos = [];
  message = '';

  fileInfos: Observable<any>;

  constructor(private uploadService: PhotoService, private router: Router) { }

  ngOnInit(): void {
  }

  selectFiles(e: { target: { files: FileList; }; }): void {
    this.progressInfos = [];
    this.selectedFiles = e.target.files;
  }

  uploadFiles(): void {
    this.message = '';
    const idTrx = 'txUF' + Math.floor(Math.random() * 999999);
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i], idTrx);
    }
    /*var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > 1500) {
        break;
      }
    }*/
    this.router.navigate(['/blukLoad', idTrx]);
  }

  upload(idx: number, file: File, idTrx: string) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.uploadService.upload(file, idTrx).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }
}