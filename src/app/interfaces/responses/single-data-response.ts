import {GenericResponse} from '@app/interfaces/responses/generic-response';

export interface SingleDataResponse<T> extends GenericResponse {

  data: T;

}
