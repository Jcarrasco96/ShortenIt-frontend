import {GenericResponse} from '@app/interfaces/generic-response';
import {Link} from '@app/models/link';

export interface LinksResponse extends GenericResponse {

  links: Link[];

}
