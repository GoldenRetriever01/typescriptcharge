export type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonSerializable | undefined }
  | Array<JsonSerializable | undefined>
