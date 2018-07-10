import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { AMapMouseToolService } from '../../managers/amap-mouse-tool.service'
import { Subscription } from 'rxjs/index'

export type MouseToolMethodType = 'marker' | 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'rule'
    | 'measureArea' | 'rectZoomIn' | 'rectZoomOut'

@Component({
    selector: 'amap-mouse-tool',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AMapMouseToolComponent implements OnInit, OnDestroy {

    @Input() options

    @Input() method: MouseToolMethodType

    @Output() draw = new EventEmitter()

    private eventSub: Subscription

    constructor(
        private mouseToolService: AMapMouseToolService,
    ) {
    }

    ngOnInit() {
        if (!this.method) {
            throw new Error('[amap] method property is required')
        }
        const mouseTool$ = this.mouseToolService.createMouseTool(this)

        mouseTool$.subscribe((mouseTool) => {
            const method = this.method
            mouseTool[method]()
        })

        this.eventSub = this.mouseToolService.createEvent$('draw', this).subscribe((evt) => {
            this.draw.next(evt)
        })

    }

    ngOnDestroy() {
        this.eventSub.unsubscribe()
        this.mouseToolService.destroy(this)
    }
}
