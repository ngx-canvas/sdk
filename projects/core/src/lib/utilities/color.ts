export class Color {
    
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(color: string) {
        if (color.indexOf('#') > -1) {
            
        } else if (color.indexOf('rgb') > -1) {
            
        } else if (color.indexOf('rgba') > -1) {
            
        } else {
            
        };
    };

}

export interface COLOR {
    'r': number;
    'g': number;
    'b': number;
    'a': number;
}