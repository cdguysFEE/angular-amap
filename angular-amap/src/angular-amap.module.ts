import { NgModule } from '@angular/core'
import { LazyMapLoaderService } from './loaders/lazy-map.loader'
import { AMapMapComponent } from './components/amap-map/amap-map.component'
import { AMapMarkerComponent } from './components/amap-marker/amap-marker.component'
import { AMapApiWrapperService } from './managers/api-wrapper.service'
import { AMapMapService } from './managers/amap-map.service'
import { AMapMarkerService } from './managers/amap-marker.service'
import { AMapInfoWindowComponent } from './components/amap-window/amap-window.component'
import { AMapInfoWindowService } from './managers/amap-infowindow.service'
import { AMapCircleComponent } from './components/amap-circle/amap-circle.component'
import { AMapCircleService } from './managers/amap-circle.service'
import { AMapTextComponent } from './components/amap-text/amap-text.component'
import { AMapTextService } from './managers/amap-text.service'
import { AMapTrafficComponent } from './components/amap-traffic/amap-traffic.component'
import { AMapTrafficService } from './managers/amap-traffic.service'
import { AMapAddressComponent } from './components/amap-address/amap-address.component'
import { AMapLocationService } from './managers/amap-location.service'
import { CommonModule } from '@angular/common'
import { AMapCircleEditorService } from './managers/amap-circle-editor.service'
import { AMapMouseToolComponent } from './components/amap-mouse-tool/mouse-tool.component'
import { AMapMouseToolService } from './managers/amap-mouse-tool.service'
import { AMapClustererComponent } from './components/amap-clusterer/amap-clusterer.component'
import { AMapClustererService } from './managers/amap-clusterer.service'

import { AMapPolylineComponent } from './components/amap-polyline/amap-polyline.component'
import { AMapPolylineService } from './managers/amap-polyline.service'

const COMPONENTS = [
    AMapMapComponent,
    AMapMarkerComponent,
    AMapInfoWindowComponent,
    AMapCircleComponent,
    AMapTextComponent,
    AMapTrafficComponent,
    AMapAddressComponent,
    AMapMouseToolComponent,
    AMapClustererComponent,
    AMapPolylineComponent,
]

const DIRECTIVES = [
]

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [...COMPONENTS, ...DIRECTIVES],
    declarations: [...COMPONENTS, ...DIRECTIVES],
    providers: [
        LazyMapLoaderService,
        AMapMapService,
        AMapMarkerService,
        AMapInfoWindowService,
        AMapCircleService,
        AMapTextService,
        AMapTrafficService,
        AMapLocationService,
        AMapCircleEditorService,
        AMapMouseToolService,
        AMapClustererService,
        AMapPolylineService,
    ],
})
export class AngularAMapModule {
    static forRoot() {
        return {
            ngModule: AngularAMapModule,
            providers: [
                AMapApiWrapperService,
            ]
        }
    }
}
