import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core'
import { Observable } from 'rxjs/index'
import { AMapPolylineService } from '../../managers/amap-polyline.service'

@Component({
    selector: 'amap-polyline',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AMapPolylineComponent implements OnInit, OnChanges, OnDestroy {
    polyline$: Observable<AMap.Polyline> = null

    @Input() path: AMap.LngLat[] | AMap.LngLatLiteral[]

    @Input() zIndex = 50

    @Input() strokeColor = '#069600'

    @Input() strokeOpacity = 1

    @Input() strokeWeight = 5

    @Input() strokeStyle = 'solid'

    @Input() isOutline = false

    @Input() borderWeight = 2

    @Input() outlineColor = '#FEA902'

    @Input() lineJoin = 'round'

    @Input() lineCap = 'round'

    @Output() polylineInit = new EventEmitter()

    constructor(
        private polylineService: AMapPolylineService,
    ) {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (!this.polyline$) {
            this.polyline$ = this.polylineService.createPolyline$(this)
            this.polyline$.subscribe((aPolyline) => {
                this.polylineInit.emit(aPolyline)
            })
        } else {
            this.polylineService.setOptions(this)
        }
    }

    ngOnDestroy() {
        this.polylineService.destroy(this)
    }
}
