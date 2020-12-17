import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service'
import { Photo } from 'src/app/interfaces/Photo';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';


interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.css']
})
export class PhotosListComponent implements OnInit {
  photos = [];

  constructor(
    private photoService: PhotoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  public photo: Photo;
  public contador: number;
  public URL: string;

  ngOnInit() {
    this.URL = 'http://' + environment.ip_server_back + ':4200/photos/';
    this.route.paramMap.subscribe(res => {
      this.contador = 0;
      while (!this.photo && this.contador <= 1500) {
        this.contador++;
        this.photoService.getAllPhotos().subscribe(photoRes => {
          this.photo = photoRes;
        })
      }
    });
  }
}
