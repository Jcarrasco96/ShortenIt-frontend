import {GenericResponse} from '@app/interfaces/generic-response';
import {Client} from '@app/interfaces/client';

export interface ClientResponse extends GenericResponse {

  client: Client;

}
