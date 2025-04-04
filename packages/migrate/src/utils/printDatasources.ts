// This is copied from prisma-client-js/runtime/utils. It needs to be moved into a separate package
import type { ConnectorType } from '@prisma/generator'
import indent from 'indent-string'

export type { ConnectorType }

export interface GeneratorConfig {
  name: string
  output: string | null
  provider: string
  config: Record<string, string>
}

export type Datasource =
  | string
  | {
      url: string
      [key: string]: any
    }

export interface InternalDatasource {
  name: string
  provider: ConnectorType
  url: string
  config: any
}

export function printDatasources(internalDatasources: InternalDatasource[]): string {
  return internalDatasources.map((d) => String(new InternalDataSourceClass(d))).join('\n\n')
}

const tab = 2

class InternalDataSourceClass {
  constructor(private readonly dataSource: InternalDatasource) {}

  public toString(): string {
    const { dataSource } = this
    const obj = {
      provider: dataSource.provider,
      url: dataSource.url,
    }
    if (dataSource.config && typeof dataSource.config === 'object') {
      Object.assign(obj, dataSource.config)
    }
    return `datasource ${dataSource.name} {
${indent(printDatamodelObject(obj), tab)}
}`
  }
}

export function printDatamodelObject(obj: any): string {
  const maxLength = Object.keys(obj).reduce((max, curr) => Math.max(max, curr.length), 0)
  return Object.entries(obj)
    .map(
      ([key, value]: [string, any]) =>
        `${key.padEnd(maxLength)} = ${
          typeof value === 'object' && value && value.value ? JSON.stringify(value.value) : JSON.stringify(value)
        }`,
    )
    .join('\n')
}
