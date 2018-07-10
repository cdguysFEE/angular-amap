import { Inject, Injectable, InjectionToken } from '@angular/core'
import { filter } from 'rxjs/internal/operators'
import { BehaviorSubject, Observable } from 'rxjs'

export const LAZY_MAPS_API_CONFIG = new InjectionToken('ngx amap config')

export interface LazyMapLoaderConfig {
    /**
     * The AMap API Key (see: http://lbs.amap.com/dev/key)
     */
    key?: string;

    /**
     * Maps API version.
     */
    v?: string;

    plugin?: string
}

@Injectable()
export class LazyMapLoaderService {
    private mapLoader$: BehaviorSubject<boolean>
    constructor(
        @Inject(LAZY_MAPS_API_CONFIG) private config: LazyMapLoaderConfig
    ) {}

    load(): Observable<boolean> {
        if (this.mapLoader$) {
            return this.getLoaderState()
        }
        this.mapLoader$ = new BehaviorSubject(false)
        if (window['AMap']) {
            this.mapLoader$.next(true)
        }
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.defer = true
        script.onload = () => {
            this.mapLoader$.next(true)
        }
        script.onerror = (err) => {
            this.mapLoader$.error(err)
        }
        script.src = this.buildReqUrl()
        document.body.appendChild(script)

        return this.getLoaderState()
    }

    private getLoaderState() {
        return this.mapLoader$.pipe(filter(item => !!item))
    }

    private buildReqUrl(): string {
        const baseUrl = 'https://webapi.amap.com/maps'
        const params = Object.keys(this.config)
            .filter(k => this.config[k])
            .map(k => {
                return `${k}=${this.config[k]}`
            }).join('&')

        return `${baseUrl}?${params}`
    }
}
