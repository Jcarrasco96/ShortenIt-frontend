import {GenericResponse} from '@app/interfaces/generic-response';
import {Link} from '@app/interfaces/link';

export interface LinkResponse extends GenericResponse {

  link: Link;

}
