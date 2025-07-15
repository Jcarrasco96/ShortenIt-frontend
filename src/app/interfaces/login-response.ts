import {GenericResponse} from '@app/interfaces/generic-response';

export interface LoginResponse extends GenericResponse {

  token: string;

}
