export class Fill {
    
    public color: string = 'rgba(255, 255, 255, 1)';

    constructor(fill?: FILL) {
        if (typeof(fill) != 'undefined' && fill != null) {
            if (typeof(fill.color) == 'string') {
                this.color = fill.color;
            };
        };
    };

}

export interface FILL {
    'color'?: string;
}