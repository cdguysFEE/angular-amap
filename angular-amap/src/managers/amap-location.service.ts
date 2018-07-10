import { Injectable, NgZone } from '@angular/core'
import { AMapApiWrapperService } from './api-wrapper.service'
import { filter, switchMap, take } from 'rxjs/internal/operators'
import { BehaviorSubject, Observable, Observer } from 'rxjs/index'

@Injectable()
export class AMapLocationService {
    geocoder$: Observable<AMap.Geocoder>
    constructor(
        private apiWrapper: AMapApiWrapperService,
        private ngZone: NgZone
    ) {
    }

    createGeocoder() {
        const subject = new BehaviorSubject(null)
        this.apiWrapper.getMap().subscribe(() => {
            this.ngZone.runOutsideAngular(() => {
                const geocoder = new AMap.Geocoder({
                    batch: true,
                    extensions: 'base'
                })
                subject.next(geocoder)
            })
        })
        const geocoder$ = subject.pipe(filter(item => !!item))
        this.geocoder$ = geocoder$

        return geocoder$
    }

    getLocation(location: AMap.LngLatLiteral | AMap.LngLat): Observable<string> {
        if (!this.geocoder$) {
            this.createGeocoder()
            this.getLocation(location)
        }

        return this.geocoder$
            .pipe(take(1))
            .pipe(switchMap(geocoder => {
                return Observable.create((observer: Observer<string>) => {
                    this.ngZone.runOutsideAngular(() => {
                        geocoder.getAddress(location, (status, result) => {
                            if (status === 'complete' && result.regeocode.formattedAddress) {
                                observer.next(result.regeocode.formattedAddress)
                            } else {
                                observer.error('address parse error')
                            }
                        })
                    })
                })
            }))

    }
}
