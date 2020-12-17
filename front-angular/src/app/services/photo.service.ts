import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Photo } from '../interfaces/Photo'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  URL = 'http://' + environment.ip_server_back + ':' + environment.port_server_back + '/api/v1';

  constructor(private http: HttpClient) { }

  createPhoto(photo: File, idTrx: string) {
    const fd = new FormData();
    const title = photo.name;
    fd.append('title', title);
    fd.append('image', photo);
    fd.append('idTrx', idTrx);
    return this.http.post(this.URL + '/photo', fd);
  }

  getInfoPhoto(id: string) {
    return this.http.get<Photo>(this.URL + '/photo/' + id);
  }

  upload(file: File, idTrx: string) {
    const formData: FormData = new FormData();
    const title = file.name;
    formData.append('title', title);
    formData.append('image', file);
    formData.append('idTrx', idTrx);
    const URLA = this.URL + "/photo";
    const request = new HttpRequest('POST', URLA, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(request);
  }

  getFiles(id: string) {
    return this.http.get<Photo>(this.URL + "/photos/" + id);
  }

  getAllPhotos() {
    return this.http.get<Photo>(this.URL + "/allphotos/");
  }

}
