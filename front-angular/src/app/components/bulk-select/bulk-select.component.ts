import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { Photo } from 'src/app/interfaces/Photo';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bulk-select',
  templateUrl: './bulk-select.component.html',
  styleUrls: ['./bulk-select.component.css']
})
export class BulkSelectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private photoService: PhotoService) { }
  public id: string;
  public photo: Photo;
  public contador: number;
  public ori_height: string;
  public ori_width: string;
  public new_height: string;
  public new_width: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe(res => {
      this.id = res.get('id');
      this.contador = 0;
      while (!this.photo && this.contador <= 1500) {
        this.contador++;
        this.photoService.getFiles(this.id).subscribe(photoRes => {
          this.photo = photoRes;
        })
      }
    });
  }
}
