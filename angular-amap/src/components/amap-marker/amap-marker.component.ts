import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { AMapMarkerService } from '../../managers/amap-marker.service'
import { take } from 'rxjs/internal/operators'
import { Observable, Subscription } from 'rxjs'

@Component({
    selector: 'amap-marker',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AMapMarkerComponent implements OnInit, OnChanges, OnDestroy {
    @Input() longitude = 0

    @Input() latitude = 0

    @Input() icon: string | AMap.Icon

    @Input() zIndex = 100

    @Input() content: string | HTMLElement

    @Input() offsetX: number

    @Input() offsetY: number

    @Output() markerClick = new EventEmitter()

    @Output() markerInit = new EventEmitter()

    aMarker$: Observable<AMap.Marker> = null
    private subscriptions: Subscription[] = []

    constructor(
        private markerService: AMapMarkerService
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
            return
        }

        if (!this.aMarker$) {
            this.aMarker$ = this.markerService.createMarker(this)
            this.aMarker$.pipe(take(1)).subscribe((aMarker) => {
                this.markerInit.emit(aMarker)
                this.addEventListeners()
            })

            return
        }

        if (changes['longitude'] || changes['latitude']) {
            this.markerService.setPosition(this)
        }

        if (changes['offsetX'] || changes['offsetY']) {
            this.markerService.setOffset(this)
        }

        if (changes['icon']) {
            this.markerService.setIcon(this)
        }

        if (changes['content']) {
            this.markerService.setContent(this)
        }

        if (changes['zIndex']) {
            this.markerService.setZIndex(this)
        }
    }

    ngOnDestroy() {
        this.markerService.destroy(this)
    }

    private addEventListeners() {
        const markerClickSub = this.markerService.createEvent$('click', this)
            .subscribe((e) => this.markerClick.emit(e))
        this.subscriptions.push(markerClickSub)
    }
}
