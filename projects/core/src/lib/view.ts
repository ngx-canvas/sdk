export const view: VIEW = {
    canvas: null,
    context: null,
    licensed: false
}

interface VIEW {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    licensed: boolean;
}