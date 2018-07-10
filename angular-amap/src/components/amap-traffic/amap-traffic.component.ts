import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core'
import { AMapTrafficService } from '../../managers/amap-traffic.service'

@Component({
    selector: 'amap-traffic',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AMapTrafficComponent implements AfterViewInit, OnDestroy {
    @Input() zIndex
    constructor(private trafficService: AMapTrafficService) {
    }

    ngAfterViewInit() {
        this.trafficService.createTrafficLayer(this)
    }

    ngOnDestroy() {
        this.trafficService.destroy()
    }
}
