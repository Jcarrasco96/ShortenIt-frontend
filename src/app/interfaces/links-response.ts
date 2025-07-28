import {GenericResponse} from '@app/interfaces/generic-response';
import {Link} from '@app/interfaces/link';

export interface LinksResponse extends GenericResponse {

  links: Link[];
  total: number;
  page: number;
  limit: number;

}
