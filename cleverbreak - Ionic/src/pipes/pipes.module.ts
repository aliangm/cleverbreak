import { NgModule } from '@angular/core';
import { StringcutPipe } from './stringcut/stringcut';
import { VideoPlayerPipe } from './video-player/video-player';
@NgModule({
	declarations: [StringcutPipe,
    VideoPlayerPipe],
	imports: [],
	exports: [StringcutPipe,
    VideoPlayerPipe]
})
export class PipesModule {}
