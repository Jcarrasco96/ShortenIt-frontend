import {inject, Injectable} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {ParamsRequest} from '@app/interfaces/params-request';
import {Observable} from 'rxjs';
import {ClientsResponse} from '@app/interfaces/clients-response';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiService = inject(ApiService)

  clients(params: ParamsRequest): Observable<ClientsResponse> {
    return this.apiService.get('v1/clients', params);
  }

}
