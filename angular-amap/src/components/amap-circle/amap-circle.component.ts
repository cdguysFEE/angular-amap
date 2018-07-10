import {
    AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
    SimpleChanges
} from '@angular/core'
import { AMapCircleService } from '../../managers/amap-circle.service'
import { Observable, Subscription } from 'rxjs/index'

@Component({
    selector: 'amap-circle',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AMapCircleComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() longitude = 0

    @Input() latitude = 0

    @Input() radius = 0

    @Input() zIndex = 10

    @Input() cursor: string

    @Input() strokeColor: string

    @Input() strokeOpacity: number

    @Input() strokeWeight: number

    @Input() fillColor: string

    @Input() fillOpacity: number

    @Input() isShow = true

    @Input() isEdit = false

    @Output() change = new EventEmitter()

    circle$: Observable<AMap.Circle> = null

    private eventSub: Subscription
    constructor(
        private circleService: AMapCircleService,
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.circle$ = this.circleService.createCircle$(this)
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.circle$) {
            return
        }

        if (changes['longitude'] || changes['latitude']) {
            this.circleService.setCenter(this)
        }

        if (changes['radius']) {
            this.circleService.setRadius(this)
        }

        if (changes['isShow']) {
            if (this.isShow) {
                this.circleService.showCircle(this)
            } else {
                this.circleService.hideCircle(this)
            }
        }

        if (changes['isEdit']) {
            if (this.isEdit) {
                this.circleService.editAbleCircle(this)
                this.addEvent()
            } else {
                this.circleService.closeCircleEditor(this)
                this.removeEvent()
            }
        }

    }

    ngOnDestroy() {
        this.circleService.destroy(this)
    }

    private addEvent() {
        this.eventSub = this.circleService.createEditorEvent$('adjust', this)
            .subscribe((evt) => {
                this.change.emit(evt)
            })
    }

    private removeEvent() {
        if (this.eventSub) {
            this.eventSub.unsubscribe()
        }
        this.change.complete()
    }
}
