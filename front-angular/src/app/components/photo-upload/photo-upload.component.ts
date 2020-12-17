import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { PhotoService } from '../../services/photo.service'
import { Photo } from '../../interfaces/Photo';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})

export class PhotoUploadComponent implements OnInit {

  photoSelected: string | ArrayBuffer;
  file: File;

  constructor(private photoService: PhotoService, private router: Router) {

  }

  ngOnInit(): void {
  }
  onPhotoSelected(event: HtmlInputEvent, title: HTMLInputElement): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
      title.value = this.file.name;
    }
  }

  uploadPhoto(title: HTMLInputElement): Boolean {
    const idTrx = 'txUF' + Math.floor(Math.random() * 999999);
    this.photoService.createPhoto(this.file, idTrx).subscribe((res: Photo) => {
      this.router.navigate(['/photos', res._id]);
    },
      err => console.log(err)
    );
    return false;
  }
}
