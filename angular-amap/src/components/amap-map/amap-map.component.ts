import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
    SimpleChanges
} from '@angular/core'
import { AMapMapService } from '../../managers/amap-map.service'
import { Observable, Subscription } from 'rxjs/index'

let mapId = 0

/**
 *  The amap-map component
 *  @example
 *  <amap-map [longitude]="116.368904" [latitude]="39.9"></amap-map>
 *
 */
@Component({
    selector: 'amap-map',
    template: `
      <div [id]="mapId" class="map-container"></div>
      <div class="map-content" [hidden]="true"><ng-content></ng-content></div>
    `,
    styleUrls: ['amap-map.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AMapMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    mapId = ''
    /**
     * The longitude that defines the center of the map.
     */
    @Input() longitude = 116.368904

    /**
     * The latitude that defines the center of the map.
     */
    @Input() latitude = 39.913423

    @Input() zoom = 6

    @Input() labelzIndex: number

    @Input() lang: string

    @Input() defaultCursor: string

    @Input() crs: string

    @Input() animateEnable = true

    @Input() isHotspot = false

    @Input() defaultLayer

    @Input() rotateEnable = false

    @Input() resizeEnable = true

    @Input() viewMode = '2D'

    @Output() mapClick: EventEmitter<AMap.MouseEvent> = new EventEmitter()

    aMap: AMap.Map

    private subscriptions: Subscription[] = []
    private aMap$: Observable<AMap.Map> = null

    constructor(
        private elemRef: ElementRef,
        private mapService: AMapMapService
    ) {
        this.mapId = AMapMapComponent.uniqueMapId()
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const mapContainerElem = this.elemRef.nativeElement.querySelector(`#${this.mapId}`)
        this.aMap$ = this.mapService.createMap(mapContainerElem, this)
        this.aMap$.subscribe((aMap) => {
            this.aMap = aMap
            this.addEventListeners()
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.aMap$) {
            return
        }
        if (changes['latitude'] || changes['longitude']) {
            this.mapService.setCenter(this)
        }

        if (changes['zoom']) {
            this.mapService.setZoom(this)
        }
    }

    addEventListeners() {
        const click = this.mapService
            .createEvent$<AMap.MouseEvent>('click')
            .subscribe((e) => this.mapClick.emit(e))
        this.subscriptions.push(click)
    }

    ngOnDestroy() {
        this.subscriptions.forEach((item) => {
            item.unsubscribe()
        })
        this.aMap$.subscribe(aMap => aMap.destroy())
        this.mapService.destroy()
    }

    setFitView(overlays) {
        this.mapService.setFitView(overlays)
    }

    static uniqueMapId() {
        return 'dt-map-id-' + mapId++
    }
}
