import {Injectable, inject} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {Observable} from 'rxjs';
import {ParamsRequest} from '@app/interfaces/params-request';
import {Link} from '@app/interfaces/models/link';
import {SingleDataResponse} from '@app/interfaces/responses/single-data-response';
import {DataResponse} from '@app/interfaces/responses/data-response';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private apiService = inject(ApiService)

  links(params: ParamsRequest): Observable<DataResponse<Link>> {
    return this.apiService.get('v1/links', params);
  }

  short(url: string): Observable<SingleDataResponse<Link>> {
    return this.apiService.post('v1/links', { url });
  }

  visit(code: string): Observable<SingleDataResponse<Link>> {
    return this.apiService.get(`v1/links/${code}/stats`);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete(`v1/links/${id}`);
  }

  update(id: string, data: {}) {
    return this.apiService.put(`v1/links/${id}`, data);
  }

}
