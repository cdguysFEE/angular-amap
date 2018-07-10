import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { AMapClustererService } from '../../managers/amap-clusterer.service'
import { Observable } from 'rxjs/index'

@Component({
    selector: 'amap-clusterer',
    template: '<ng-content></ng-content>'
})
export class AMapClustererComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() locations

    @Input() averageCenter

    clusterer$: Observable<AMap.MarkerClusterer>
    constructor(
        private clustererService: AMapClustererService
    ) {
    }

    ngAfterViewInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.clusterer$) {
            return this.clusterer$ = this.clustererService.createClusterer(this)
        }
        if (changes['locations']) {
            this.clustererService.setMarkers(this)
        }
    }

    ngOnDestroy() {
        this.clustererService.destroy(this)
    }
}
