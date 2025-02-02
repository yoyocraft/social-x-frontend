export enum ConfigType {
  STRING = 'STRING',
  JSON = 'JSON',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  LONG = 'LONG',
  MAP = 'MAP',
  LIST = 'LIST',
  HTML = 'HTML',
  DEFAULT = 'STRING',
}

export const ConfigTypeTagColor: { [key: string]: string } = {
  STRING: 'success',
  JSON: 'purple',
  INTEGER: 'blue',
  BOOLEAN: 'red',
  LONG: 'cyan',
  MAP: 'geekblue',
  LIST: 'magenta',
  HTML: 'volcano',
};

export const ConfigMonacoEditorLanguage: { [key: string]: string } = {
  JSON: 'json',
  HTML: 'html',
  DEFAULT: 'markdown',
  STRING: 'markdown',
};
