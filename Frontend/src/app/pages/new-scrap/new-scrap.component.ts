import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/video.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-new-scrap',
  templateUrl: './new-scrap.component.html',
  styleUrls: ['./new-scrap.component.scss']
})
export class NewScrapComponent implements OnInit {

  constructor(private videosService: VideoService, private router: Router) { }

  ngOnInit(): void {
  }

  scrapPerfil(input: string) {
      if (input == '') {
          return alert('Ingrese un perfil para realizar el scraping!')
      }
      this.router.navigate(['/perfiles'])
      this.videosService.scrapPerfil(input).subscribe((response: any) => {
          console.log(response)
      })
  }
}
