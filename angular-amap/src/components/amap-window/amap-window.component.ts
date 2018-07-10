import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output,
    SimpleChanges
} from '@angular/core'
import { AMapInfoWindowService } from '../../managers/amap-infowindow.service'
import { Observable, Subscription } from 'rxjs'

@Component({
    selector: 'amap-infowindow',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AMapInfoWindowComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() isCustom: boolean
    @Input() autoMove: boolean
    @Input() closeWhenClickMap: boolean
    @Input() size
    @Input() offsetX = 0
    @Input() offsetY = 0
    @Input() longitude = 0
    @Input() latitude = 0

    @Input() showShadow: boolean

    @Input() isOpen = false

    @Output() change = new EventEmitter()
    @Output() open = new EventEmitter()
    @Output() close = new EventEmitter()

    content: HTMLElement

    private subscriptions: Subscription[] = []

    private aInfoWindow$: Observable<AMap.InfoWindow>

    constructor(
        private elemRef: ElementRef,
        private infoWindowService: AMapInfoWindowService
    ) {
    }

    ngAfterViewInit() {
        this.content = this.elemRef.nativeElement
        this.aInfoWindow$ = this.infoWindowService.createInfoWindow(this)
        this.aInfoWindow$.subscribe(() => {
            this.addEventListeners()
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
            return
        }

        if (!this.aInfoWindow$) {
            return
        }

        if (changes['longitude'] || changes['latitude']) {
            this.infoWindowService.changePosition(this)
        }

        if (changes['isOpen']) {
            if (this.isOpen) {
                this.infoWindowService.openInfoWindow(this)
            } else {
                this.infoWindowService.closeInfoWindow(this)
            }
        }

        if (changes['offsetX'] || changes['offsetY']) {
            this.infoWindowService.setOffset(this)
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(item => item.unsubscribe())
        this.infoWindowService.destroy(this)
    }

    private addEventListeners() {
        const changeSub = this.infoWindowService
            .createEvent$('change', this).subscribe((e) => this.change.emit(e))
        this.subscriptions.push(changeSub)

        const closeSub = this.infoWindowService
            .createEvent$('close', this).subscribe((e) => this.close.emit(e))
        this.subscriptions.push(closeSub)

        const openSub = this.infoWindowService
            .createEvent$('open', this).subscribe((e) => this.open.emit(e))
        this.subscriptions.push(openSub)
    }
}
