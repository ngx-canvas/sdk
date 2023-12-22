export const enum KeyboardCommand {
  Cut = 'CTRL:X',
  Undo = 'CTRL:Z',
  Redo = 'CTRL:Y',
  Copy = 'CTRL:C',
  Paste = 'CTRL:V',
  Group = 'CTRL:G',
  Ungroup = 'CTRL:U',
  SendToBack = 'CTRL:SHIFT:DOWN',
  BringForward = 'CTRL:UP',
  SendBackward = 'CTRL:DOWN',
  BringToFront = 'CTRL:SHIFT:UP',
  AlignTopEdges = 'CTRL:ALT:SHIFT:UP',
  AlignLeftEdges = 'CTRL:ALT:SHIFT:LEFT',
  AlignRightEdges = 'CTRL:ALT:SHIFT:RIGHT',
  AlignBottomEdges = 'CTRL:ALT:SHIFT:DOWN',
  AlignVerticalCenters = 'CTRL:ALT:SHIFT:V',
  AlignAbsoluteCenters = 'CTRL:SHIFT:C',
  AlignHorizontalCenters = 'CTRL:ALT:SHIFT:H'
}

export const GetKeyboardCommand = (event: KeyboardEvent) => {
  let command: string | string[] = []
  if (event.ctrlKey) command.push('CTRL')
  if (event.altKey) command.push('ALT')
  if (event.shiftKey) command.push('SHIFT')
  if (event.key === 'ArrowUp') command.push('UP')
  if (event.key === 'ArrowDown') command.push('DOWN')
  if (event.key === 'ArrowLeft') command.push('LEFT')
  if (event.key === 'ArrowRight') command.push('RIGHT')
  if (event.key === 'c') command.push('C')
  if (event.key === 'u') command.push('U')
  if (event.key === 'v') command.push('V')
  if (event.key === 'h') command.push('H')
  if (event.key === 'g') command.push('G')
  if (event.key === 'x') command.push('X')
  if (event.key === 'y') command.push('Y')
  if (event.key === 'z') command.push('Z')
  command = command.join(':')

  switch (command) {
    case KeyboardCommand.Cut:
    case KeyboardCommand.Undo:
    case KeyboardCommand.Redo:
    case KeyboardCommand.Copy:
    case KeyboardCommand.Paste:
    case KeyboardCommand.Group:
    case KeyboardCommand.Ungroup:
    case KeyboardCommand.SendToBack:
    case KeyboardCommand.BringForward:
    case KeyboardCommand.SendBackward:
    case KeyboardCommand.BringToFront:
    case KeyboardCommand.AlignTopEdges:
    case KeyboardCommand.AlignLeftEdges:
    case KeyboardCommand.AlignRightEdges:
    case KeyboardCommand.AlignBottomEdges:
    case KeyboardCommand.AlignVerticalCenters:
    case KeyboardCommand.AlignAbsoluteCenters:
    case KeyboardCommand.AlignHorizontalCenters:
      event.preventDefault()
      event.stopPropagation()
      break
  }

  return <KeyboardCommand>command
}