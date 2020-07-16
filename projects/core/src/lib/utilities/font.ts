export class Font {
    
    public size:        number = 14;
    public color:       string = 'rgba(0, 0, 0, 1)';
    public family:      string = 'sans-serif';
    public baseline:    string = 'middle';
    public alignment:   string = 'center';

    constructor(font?: FONT) {
        if (typeof(font) != 'undefined' && font != null) {
            if (typeof(font.size) == 'number') {
                this.size = font.size;
            };
            if (typeof(font.color) == 'string') {
                this.color = font.color;
            };
            if (typeof(font.family) == 'string') {
                this.family = font.family;
            };
            if (typeof(font.baseline) == 'string') {
                this.baseline = font.baseline;
            };
            if (typeof(font.alignment) == 'string') {
                this.alignment = font.alignment;
            };
        };
    };

}

export interface FONT {
    'size'?:        number;
    'color'?:       string;
    'family'?:      string;
    'baseline'?:    string;
    'alignment'?:   string;
}