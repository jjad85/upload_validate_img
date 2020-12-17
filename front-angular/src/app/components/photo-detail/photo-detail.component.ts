import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Photo } from 'src/app/interfaces/Photo';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  public id: string;
  public photo: Photo;

  constructor(private route: ActivatedRoute, private photoService: PhotoService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(res => {
      this.id = res.get('id');
      if (this.id) {
        this.photoService.getInfoPhoto(this.id).subscribe(photoRes => {
          this.photo = photoRes;
        })
      } else {
        alert("You have not selected a photo");
        this.router.navigate(['/']);
      }
    });
  }

}
