import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClimaRequest } from '../models/request/ClimaRequest';
import { Response } from '../models/Response';

const httpOption = {
  headers: new HttpHeaders({ 'Contend-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  private _url: string = 'https://localhost:7258/api/clima/';

  constructor(private _http: HttpClient) { }

  create(model: ClimaRequest): Observable<Response> {
    return this._http.post<Response>(this._url, model, httpOption);
  }

  read(): Observable<Response> {
    return this._http.get<Response>(this._url);
  }

  update(model: ClimaRequest): Observable<Response> {
    return this._http.put<Response>(this._url, model, httpOption);
  }

  delete(id: number): Observable<Response> {
    return this._http.delete<Response>(this._url + id);
  }


}
