export * from '../interfaces/RelipayConfig';

export type DynamicFormControl = {
  label: string;
  name: string
  placeholder: string
  required: boolean
  type: string
  typeGroup: string | {
    type: string
    values: {name: string, value: string}[]
  }
  value: string
  width: number,
  disabled: boolean
}
