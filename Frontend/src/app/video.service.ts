import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private webRequestService: WebRequestService) { }

  getPerfiles() {
    return this.webRequestService.get('perfiles');
  }

  getVideos(perfilId: string) {
    return this.webRequestService.get(`perfiles/${perfilId}/videos`);
  }

  getVideosDetail(perfilId: string, videoId: string){
    return this.webRequestService.get(`perfiles/${perfilId}/videos/${videoId}`)
  }

  getPerfilInfo(perfilId: string) {
      return this.webRequestService.get(`perfiles/${perfilId}`)
  }

  scrapPerfil(input: string) {
      return this.webRequestService.post('scrap', { input })
  }

  dataVideos(perfilId: string) {
      return this.webRequestService.getCSV(`datavideos/${perfilId}`)
  }
}
