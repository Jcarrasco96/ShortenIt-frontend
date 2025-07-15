import {GenericResponse} from '@app/interfaces/generic-response';
import {Link} from '@app/models/link';

export interface LinkResponse extends GenericResponse {

  link: Link;

}
