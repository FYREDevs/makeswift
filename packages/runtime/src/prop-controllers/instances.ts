import { Editor } from 'slate-react'
import { ValueJSON } from 'slate'
import { OnChangeParam } from 'slate-react'
import { Descriptor, RichTextDescriptor, TableFormFieldsDescriptor, Types } from './descriptors'
import { BuilderEditMode } from '../utils/constants'
import { BoxModel } from '../state/modules/box-models'
import { SlotControl, SlotControlMessage, SlotControlType } from '../controls'

export const RichTextPropControllerMessageType = {
  CHANGE_BUILDER_EDIT_MODE: 'CHANGE_BUILDER_EDIT_MODE',
  INITIALIZE_EDITOR: 'INITIALIZE_EDITOR',
  CHANGE_EDITOR_VALUE: 'CHANGE_EDITOR_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  UNDO: 'UNDO',
  REDO: 'REDO',
} as const

type ChangeBuilderEditModeRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.CHANGE_BUILDER_EDIT_MODE
  editMode: BuilderEditMode
}

type InitializeEditorRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.INITIALIZE_EDITOR
  value: ValueJSON
}

type ChangeEditorValueRichTextPropControllerMessage = {
  type: typeof RichTextPropControllerMessageType.CHANGE_EDITOR_VALUE
  value: ValueJSON
}

type FocusRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.FOCUS }

type BlurRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.BLUR }

type UndoRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.UNDO }

type RedoRichTextPropControllerMessage = { type: typeof RichTextPropControllerMessageType.REDO }

export type RichTextPropControllerMessage =
  | ChangeBuilderEditModeRichTextPropControllerMessage
  | InitializeEditorRichTextPropControllerMessage
  | ChangeEditorValueRichTextPropControllerMessage
  | FocusRichTextPropControllerMessage
  | BlurRichTextPropControllerMessage
  | UndoRichTextPropControllerMessage
  | RedoRichTextPropControllerMessage

export type PropControllerMessage =
  | RichTextPropControllerMessage
  | TableFormFieldsMessage
  | SlotControlMessage

export type Send<T = PropControllerMessage> = (message: T) => void

export abstract class PropController<T = PropControllerMessage> {
  protected send: Send<T>

  constructor(send: Send<T>) {
    this.send = send
  }

  abstract recv(message: T): void
}

class DefaultPropController extends PropController {
  recv(_message: PropControllerMessage): void {
    // Do nothing.
  }
}

class RichTextPropController extends PropController<RichTextPropControllerMessage> {
  private editor: Editor | null = null

  recv(message: RichTextPropControllerMessage): void {
    switch (message.type) {
      case RichTextPropControllerMessageType.CHANGE_BUILDER_EDIT_MODE: {
        switch (message.editMode) {
          case BuilderEditMode.BUILD:
            this.editor?.deselect().blur()
            break

          case BuilderEditMode.CONTENT:
            this.editor?.focus().moveToRangeOfDocument()
            break
        }

        break
      }
    }
  }

  setSlateEditor(editor: Editor) {
    this.editor = editor

    this.send({
      type: RichTextPropControllerMessageType.INITIALIZE_EDITOR,
      value: editor.value.toJSON({ preserveSelection: false }),
    })
  }

  onChange(change: OnChangeParam) {
    this.send({
      type: RichTextPropControllerMessageType.CHANGE_EDITOR_VALUE,
      value: change.value.toJSON({ preserveSelection: true }),
    })
  }

  focus() {
    this.send({ type: RichTextPropControllerMessageType.FOCUS })
  }

  blur() {
    this.send({ type: RichTextPropControllerMessageType.BLUR })
  }

  undo() {
    this.send({ type: RichTextPropControllerMessageType.UNDO })
  }

  redo() {
    this.send({ type: RichTextPropControllerMessageType.REDO })
  }
}

export const TableFormFieldsMessageType = {
  TABLE_FORM_LAYOUT_CHANGE: 'TABLE_FORM_LAYOUT_CHANGE',
  TABLE_FORM_FIELD_LAYOUT_CHANGE: 'TABLE_FORM_FIELD_LAYOUT_CHANGE',
} as const

type TableLayoutTableFormFieldsMessage = {
  type: typeof TableFormFieldsMessageType.TABLE_FORM_LAYOUT_CHANGE
  payload: { layout: BoxModel }
}

type TableFieldLayoutTableFormFieldsMessage = {
  type: typeof TableFormFieldsMessageType.TABLE_FORM_FIELD_LAYOUT_CHANGE
  payload: { layout: BoxModel; index: number }
}

export type TableFormFieldsMessage =
  | TableLayoutTableFormFieldsMessage
  | TableFieldLayoutTableFormFieldsMessage

export class TableFormFieldsPropController extends PropController<TableFormFieldsMessage> {
  recv(): void {}

  tableFormLayoutChange(payload: { layout: BoxModel }) {
    this.send({ type: TableFormFieldsMessageType.TABLE_FORM_LAYOUT_CHANGE, payload })
  }

  tableFormFieldLayoutChange(payload: { layout: BoxModel; index: number }) {
    this.send({ type: TableFormFieldsMessageType.TABLE_FORM_FIELD_LAYOUT_CHANGE, payload })
  }
}

type DescriptorPropController<T extends Descriptor> = T extends { type: typeof Types.RichText }
  ? RichTextPropController
  : T extends { type: typeof Types.TableFormFields }
  ? TableFormFieldsPropController
  : DefaultPropController

export type DescriptorsPropControllers<T extends Record<string, Descriptor>> = {
  [K in keyof T]: undefined extends T[K]
    ? DescriptorPropController<Exclude<T[K], undefined>>
    : DescriptorPropController<T[K]>
}

type AnyPropController =
  | DefaultPropController
  | RichTextPropController
  | TableFormFieldsPropController
  | SlotControl

export function createPropController(
  descriptor: RichTextDescriptor,
  send: Send<RichTextPropControllerMessage>,
): RichTextPropController
export function createPropController(
  descriptor: TableFormFieldsDescriptor,
  send: Send<TableFormFieldsMessage>,
): TableFormFieldsPropController
export function createPropController(descriptor: Descriptor, send: Send): DefaultPropController
export function createPropController<T extends PropControllerMessage>(
  descriptor: Descriptor,
  send: Send<T>,
): AnyPropController {
  switch (descriptor.type) {
    case Types.RichText:
      return new RichTextPropController(send as Send<RichTextPropControllerMessage>)

    case Types.TableFormFields:
      return new TableFormFieldsPropController(send as Send<TableFormFieldsMessage>)

    case SlotControlType:
      return new SlotControl(send as Send<SlotControlMessage>)

    default:
      return new DefaultPropController(send as Send)
  }
}
