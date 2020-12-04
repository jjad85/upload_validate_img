import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  server = environment.server_api
  port = environment.port_api
  URI = 'http://' + this.server + ':' + this.port + '/api/v1/imagen';
  constructor(private http: HttpClient) { }

  createPhoto(title: string, rutaFis: string) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify({ rutaImagen: rutaFis, nombreImagen: title })
    return this.http.post(this.URI, body, { 'headers': headers });
  }
}
