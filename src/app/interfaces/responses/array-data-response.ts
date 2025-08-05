import {GenericResponse} from '@app/interfaces/responses/generic-response';

export interface ArrayDataResponse<T> extends GenericResponse {

  data: T[];

}
