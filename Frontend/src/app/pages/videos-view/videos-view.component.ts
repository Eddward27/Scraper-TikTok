import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/video.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-videos-view',
  templateUrl: './videos-view.component.html',
  styleUrls: ['./videos-view.component.scss']
})
export class VideosViewComponent implements OnInit {

  perfiles: any[];
  videos: any[];

  constructor(private videosService: VideoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.videosService.getVideos(params.perfilId).subscribe((videos: any[]) => {
          this.videos = videos;
        })
      }
    )
    this.videosService.getPerfiles().subscribe((perfiles: any[]) => {
      this.perfiles = perfiles;
    })
  }
}
