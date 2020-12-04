import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { environment } from '../../../environments/environment';
import { photoUpload } from './photo-upload.model';

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
  onPhotoSelected(event: HtmlInputEvent, title: HTMLInputElement, rutaFis: HTMLInputElement): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
      title.value = this.file.name;
    }

    const archivos = event.target.files;
    const data = new FormData();
    var resp = "";
    data.append('archivo', archivos[0]);

    var server = environment.server_api;
    var port = environment.port_api;

    var URL_api = 'http://' + server + ':' + port + '/api/v1/subirImagen'

    fetch(URL_api, {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(json => rutaFis.value = json.path)
      .catch(error => {
        console.error(error);
      });
  }

  uploadPhoto(title: HTMLInputElement, rutaFis: HTMLInputElement,
    divImagen: HTMLInputElement, resultado: HTMLInputElement,
    modif: HTMLInputElement, txtAltoO: HTMLInputElement,
    txtAnchoO: HTMLInputElement, txtAltoN: HTMLInputElement,
    txtAnchoN: HTMLInputElement, horizontal: HTMLInputElement,
    urlO: HTMLInputElement, urlN: HTMLInputElement): Boolean {
    this.photoService.createPhoto(title.value, rutaFis.value).subscribe((res: photoUpload) => {
      //this.router.navigate(['/photos'])
      console.log(res);
      divImagen.style.display = 'none';
      resultado.style.display = 'block';
      if (res.modificada === true) {
        modif.checked = true;
      }
      if (res.horizontal === true) {
        horizontal.checked = true;
      }
      txtAltoO.value = res.alto_orig;
      txtAnchoO.value = res.ancho_orig;
      txtAltoN.value = res.alto_new;
      txtAnchoN.value = res.ancho_new;
      urlO.value = res.urlAWSOriginal;
      urlN.value = res.urlAWSModificada;
    },
      err => console.log(err)
    );
    return false;
  }
}
