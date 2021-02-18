import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideosViewComponent } from "./pages/videos-view/videos-view.component";
import { VideosDetailViewComponent } from "./pages/videos-detail-view/videos-detail-view.component";
import { PerfilesViewComponent } from "./pages/perfiles-view/perfiles-view.component";
import { MainViewComponent } from "./pages/main-view/main-view.component";
import { NewScrapComponent } from "./pages/new-scrap/new-scrap.component";

const routes: Routes = [
    { path: '', redirectTo: 'perfiles', pathMatch: 'full' },
    { path: 'perfiles', component: MainViewComponent },
    { path: 'perfiles/:perfilId', component: PerfilesViewComponent },
    { path: 'perfiles/:perfilId/videos', component: VideosViewComponent },
    { path: 'perfiles/:perfilId/videos/:videoId', component: VideosDetailViewComponent },
    { path: 'new-scrap', component: NewScrapComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
