import * as fs from 'fs'
import readdir, { Options } from '@jsdevtools/readdir-enhanced'

function myFilter(stats, { prefix }) {
  return (stats.isDirectory()
    || prefix.some(prefix => stats.path.endsWith(prefix)))
    && !stats.path.startsWith('.')
}

const getName = (path: string): string => {
  let name = path
  const lastIndex = path.lastIndexOf('/')
  if (lastIndex > -1)
    name = path.substring(lastIndex + 1)

  return name
}

const formatDirectoryName = (name: string): string => {
  return `- __${name}__\n`
}

const formatFileName = (name: string, path: string): string => {
  return `- [${name}](${path})\n`
}

const addIndentation = (i: number): string => {
  return ' '.repeat(i * 2 + 1)
}

const getCount = (string: string): number => {
  let count = 0
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '/')
      count = count + 1
  }
  return count
}

function ignoreNodeModules(stats, options) {
  return options.ignore.every(v => !stats.path.includes(v))
}

const defaultOptions = {
  formatFileName,
  formatDirectoryName,
  deep: stats => ignoreNodeModules(stats, defaultOptions),
  filter: stats => myFilter(stats, defaultOptions),
  outputFilePath: 'list.md',
  prefix: ['.html'],
  ignore: ['node_modules', '.git', '.idea'],
}

interface AllOptions extends Options {
  formatDirectoryName: (name: string) => string
  formatFileName: (name: string, path: string) => string
  outputFilePath: string
  prefix: string[]
}

export const generateMdTree = (path = '.', options: AllOptions) => {
  options = { ...defaultOptions, ...options }
  const { outputFilePath, formatFileName, formatDirectoryName } = options
  // @ts-ignore
  return readdir.async(path, options)
    .then((files) => {
      files = files.sort()
      let indentation = 0
      let output = ''
      files.forEach((filePath, index) => {
        const nextFilePath = files[index + 1]
        if (!options.prefix.some(prefix => filePath.endsWith(prefix))
          && nextFilePath
          && !nextFilePath.includes(filePath)
        ) return

        indentation = getCount(filePath)
        const filename = getName(filePath)
        const name = options.prefix.some(v => filePath.endsWith(v))
          ? formatFileName(filename, filePath)
          : formatDirectoryName(filename)
        output += addIndentation(indentation) + name
      })
      fs.writeFileSync(outputFilePath, output)
      return { output, files }
    })
    .catch(() => {
    })
}
