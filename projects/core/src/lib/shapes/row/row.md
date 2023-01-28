# Row
This will draw a row on the canvas!

## Usage
```ts
import { Row } from '@ngx-canvas/core';

const row = new Row({}: SHAPE);

row.apply();
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