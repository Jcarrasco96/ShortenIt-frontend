import {inject, Injectable} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {ParamsRequest} from '@app/interfaces/params-request';
import {Observable} from 'rxjs';
import {SingleDataResponse} from '@app/interfaces/responses/single-data-response';
import {User} from '@app/interfaces/models/user';
import {DataResponse} from '@app/interfaces/responses/data-response';
import {ArrayDataResponse} from '@app/interfaces/responses/array-data-response';
import {UserStaff} from '@app/interfaces/models/user-staff';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiService = inject(ApiService)

  users(params: ParamsRequest): Observable<DataResponse<User>> {
    return this.apiService.get('v1/admin/users', params);
  }

  create(name: string, position: string, email: string, phone_number: string): Observable<SingleDataResponse<User>> {
    return this.apiService.post('v1/admin/users', {
      name, position, email, phone_number
    });
  }

  update(id: string, data: {}): Observable<SingleDataResponse<User>> {
    return this.apiService.put(`v1/admin/user/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete(`v1/admin/user/${id}`);
  }

  updateCertifications(id: string, data: {}): Observable<SingleDataResponse<User>> {
    return this.apiService.put(`v1/admin/user/${id}/certifications`, data);
  }

  staffRenew(): Observable<ArrayDataResponse<UserStaff>> {
    return this.apiService.get('v1/staff/renew');
  }

}
