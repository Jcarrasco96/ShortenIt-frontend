import {GenericResponse} from '@app/interfaces/responses/generic-response';

export interface LoginResponse extends GenericResponse {

  access_token: string;
  refresh_token: string;

}
