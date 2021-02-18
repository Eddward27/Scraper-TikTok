import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideosViewComponent } from './pages/videos-view/videos-view.component';

import { HttpClientModule } from '@angular/common/http';
import { PerfilesViewComponent } from './pages/perfiles-view/perfiles-view.component';
import { NewScrapComponent } from './pages/new-scrap/new-scrap.component';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { VideosDetailViewComponent } from './pages/videos-detail-view/videos-detail-view.component';

@NgModule({
  declarations: [
    AppComponent,
    VideosViewComponent,
    PerfilesViewComponent,
    NewScrapComponent,
    MainViewComponent,
    VideosDetailViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
