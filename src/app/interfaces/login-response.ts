import {GenericResponse} from '@app/interfaces/generic-response';

export interface LoginResponse extends GenericResponse {

  access_token: string;
  refresh_token: string;

}
