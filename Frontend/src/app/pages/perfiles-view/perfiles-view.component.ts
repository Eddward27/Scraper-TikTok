import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/video.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-perfiles-view',
  templateUrl: './perfiles-view.component.html',
  styleUrls: ['./perfiles-view.component.scss']
})
export class PerfilesViewComponent implements OnInit {

  perfilInfo: any;
  perfiles: any[];

  constructor(private videosService: VideoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.route.params.subscribe(
        (params: Params) => {
          this.videosService.getPerfilInfo(params.perfilId).subscribe((perfilInfo: any) => {
            this.perfilInfo = perfilInfo;
          })
          this.videosService.getPerfiles().subscribe((perfiles: any[]) => {
            this.perfiles = perfiles;
          })
        }
    )
  }

  scrapPerfil(input: string) {
      this.videosService.scrapPerfil(input).subscribe((response: any) => {
          console.log(response)
      })
  }

//Crea el archivo .csv a descargar desde la API
  dataVideos(input: string, fineName: string) {
      this.videosService.dataVideos(input).subscribe((response: any) => {
          const blob = new Blob([response], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('hidden', '');
          a.setAttribute('href', url);
          a.setAttribute('download', `${fineName}`);
          document.body.appendChild(a);
          a.click()
          document.body.removeChild(a);
      })
  }
}
