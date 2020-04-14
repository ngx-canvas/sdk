import { view } from '../view';

export class License {

    public licensed:    boolean = true;
    public image:       any;
    
    constructor(key?: string) {
        if (typeof(key) != "undefined") {
            // const request = new Request('https://ngxcanvas.com/api/licences/validate', {
            //     'body': JSON.stringify({
            //         'key': key
            //     }),
            //     'method': 'POST',
            // });

            // fetch(request).then(res => {
            //     this.licensed = true;
            // }, err => {
            //     this.licensed = false;
            // });
        } else {
            // this.licensed = false;
        };

        this.image      = new Image();
        this.image.src  = 'https://raw.githubusercontent.com/ngx-canvas/core/master/projects/demo/src/assets/plug.png';

        this.check();
    };

    private check() {
        view.licensed = this.licensed;
        window.requestAnimationFrame(() => this.check());
    };

}

export interface LICENCE {
    'licensed': boolean;
}