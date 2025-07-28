import {Injectable, inject} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {Observable} from 'rxjs';
import {LinksResponse} from '@app/interfaces/links-response';
import {LinkResponse} from '@app/interfaces/link-response';
import {ParamsRequest} from '@app/interfaces/params-request';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private apiService = inject(ApiService)

  links(params: ParamsRequest): Observable<LinksResponse> {
    return this.apiService.get('v1/links', params);
  }

  short(url: string): Observable<LinkResponse> {
    return this.apiService.post('v1/links', { url });
  }

  visit(code: string): Observable<LinkResponse> {
    return this.apiService.get(`v1/links/${code}/stats`);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete(`v1/links/${id}`);
  }

  update(id: string, data: {}) {
    return this.apiService.put(`v1/links/${id}`, data);
  }

}
