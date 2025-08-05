import {inject, Injectable} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {DataResponse} from '@app/interfaces/responses/data-response';
import {Client} from '@app/interfaces/models/client';
import {ClientSearchFilters} from '@app/interfaces/client-search-filters';
import {ClientParamsRequest} from '@app/interfaces/client-params-request';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiService = inject(ApiService)

  clients(params: ClientParamsRequest): Observable<DataResponse<Client>> {
    const paramsToSend = this.buildClientQueryParams(params.page, params.limit, params.order, params.filters);

    return this.apiService.get('v1/clients', paramsToSend);
  }

  private buildClientQueryParams(page: number, limit: number, order: string, filters: ClientSearchFilters): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (filters && Object.keys(filters).length > 0) {
      const searchParts = Object.entries(filters)
        .filter(([_, value]) => value !== null && value !== '')
        .map(([key, value]) => `${key}:${value}`)
        .join(',');

      if (searchParts.length > 0) {
        params = params.set('search', searchParts);
      }
    }

    return params;
  }

}
