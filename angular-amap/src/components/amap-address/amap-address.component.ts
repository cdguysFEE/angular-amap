import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { AMapLocationService } from '../../managers/amap-location.service'
import { Subscription } from 'rxjs/index'

@Component({
    selector: 'amap-address',
    template: '<div class="amap-address">{{address}}</div>',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AMapAddressComponent implements OnChanges, OnDestroy {
    @Input() longitude = 0

    @Input() latitude = 0
    address = '-'
    private addressSub: Subscription
    constructor(
        private locationService: AMapLocationService,
        private cdf: ChangeDetectorRef,
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.latitude && this.longitude) {
            this.addressSub = this.locationService
                .getLocation([this.longitude, this.latitude]).subscribe((address) => {
                    this.address = address
                    this.cdf.detectChanges()
                })
        }
    }

    ngOnDestroy() {
        if (this.addressSub) {
            this.addressSub.unsubscribe()
        }
    }
}
