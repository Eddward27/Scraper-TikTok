import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/video.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-videos-detail-view',
  templateUrl: './videos-detail-view.component.html',
  styleUrls: ['./videos-detail-view.component.scss']
})
export class VideosDetailViewComponent implements OnInit {

  perfiles: any[];
  videosDet: any[];

  constructor(private videosService: VideoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.videosService.getVideosDetail(params.perfilId, params.videoId).subscribe((videosDet: any[]) => {
          this.videosDet = videosDet;
        })
      }
    )
    this.videosService.getPerfiles().subscribe((perfiles: any[]) => {
      this.perfiles = perfiles;
    })
  }
}
