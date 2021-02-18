import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/video.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  perfiles: any[];

  constructor(private videosService: VideoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.route.params.subscribe(
        (params: Params) => {
          this.videosService.getPerfiles().subscribe((perfiles: any[]) => {
            this.perfiles = perfiles
          })
        }
      )
  }
}
