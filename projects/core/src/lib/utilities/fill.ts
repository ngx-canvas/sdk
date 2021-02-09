export class Fill {

    public color: string = '#FFFFFF';
    public opacity: number = 100;

    constructor(args?: FILL) {
        if (typeof (args) != 'undefined' && args != null) {
            if (typeof (args.color) != 'undefined' && args.color !== null) {
                this.color = args.color;
            };
            if (typeof (args.opacity) != 'undefined' && args.opacity !== null) {
                this.opacity = args.opacity;
            };
        };
    };

}

export interface FILL {
    color?: string;
    opacity?: number;
}