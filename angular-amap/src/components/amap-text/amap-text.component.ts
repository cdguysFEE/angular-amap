import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { AMapTextService } from '../../managers/amap-text.service'
import { Observable } from 'rxjs/index'

@Component({
    selector: 'amap-text',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AMapTextComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input() longitude = 0

    @Input() latitude = 0

    @Input() text = ''

    private text$: Observable<AMap.Text>
    constructor(private textService: AMapTextService) {
    }

    ngAfterViewInit() {
        this.text$ = this.textService.createText$(this)

        this.text$.subscribe()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.text$) {
            return
        }
        if (changes['longitude'] || changes['latitude']) {
            this.textService.setPosition(this)
        }
        if (changes['text']) {
            this.textService.setText(this)
        }
    }

    ngOnDestroy() {
        this.textService.destroy(this)
    }
}
