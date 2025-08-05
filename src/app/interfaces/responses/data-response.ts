import {GenericResponse} from '@app/interfaces/responses/generic-response';

export interface DataResponse<T> extends GenericResponse {

  data: T[];
  total: number;
  page: number;
  limit: number;

}
