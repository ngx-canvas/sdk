# Column
This will draw a column on the canvas!

## Usage
```ts
import { Column } from '@ngx-canvas/core';

const column = new Column({}: SHAPE);

column.apply();
```

### Inputs

| Property    | Type      | Default         | Required  | Description |
|-------------|-----------|-----------------|-----------|-------------|
| id          | string    | ObjectId()      | Optional  |             |
| fill        | Fill      | new Fill()      | Optional  |             |
| font        | Font      | new Font()      | Optional  |             |
| data        | any       | {}              | Optional  |             |
| type        | string    | 'rectangle'     | Optional  |             |
| name        | string    | ''              | Optional  |             |
| stroke      | Stroke    | new Stroke()    | Optional  |             |
| hidden      | boolean   | false           | Optional  |             |
| selected    | boolean   | false           | Optional  |             |
| dragging    | boolean   | false           | Optional  |             |
| position    | Position  | new Position()  | Optional  |             |
| children    | Shape[]   | []              | Optional  |             |
| conditions  | any[]     | []              | Optional  |             |
|-------------|-----------|-----------------|-----------|-------------|

### Outputs