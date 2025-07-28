import {GenericResponse} from '@app/interfaces/generic-response';
import {Client} from '@app/interfaces/client';

export interface ClientsResponse extends GenericResponse {

  clients: Client[];
  total: number;
  page: number;
  limit: number;

}
