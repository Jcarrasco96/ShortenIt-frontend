import {Injectable} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {Observable} from 'rxjs';
import {LinksResponse} from '@app/interfaces/links-response';
import {LinkResponse} from '@app/interfaces/link-response';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  constructor(
    private apiService: ApiService
  ) {
  }

  getLinks(): Observable<LinksResponse> {
    return this.apiService.get('v1/links?order=original_url:asc');
  }

  shortenUrl(url: string): Observable<LinkResponse> {
    return this.apiService.post('v1/links', { url });
  }

  visitLink(code: string): Observable<LinkResponse> {
    return this.apiService.get(`v1/links/${code}/stats`);
  }

  deleteLink(id: string): Observable<void> {
    return this.apiService.delete(`v1/links/${id}`);
  }

}
