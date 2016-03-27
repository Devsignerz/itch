
import invariant from 'invariant'

import os from '../util/os'

import mklog from '../util/log'
const log = mklog('tasks/configure')
import pathmaker from '../util/pathmaker'

import html from './configure/html'

async function configure (appPath) {
  const platform = os.platform()

  switch (platform) {
    case 'win32':
    case 'darwin':
    case 'linux':
      const configurator = require(`./configure/${platform}`).default
      return await configurator.configure(appPath)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

export default async function start (out, opts) {
  console.log('configure opts: ', opts)
  const {cave, upload, game, globalMarket} = opts
  invariant(cave, 'configure has cave')
  invariant(game, 'configure has game')
  invariant(upload, 'configure has upload')

  const appPath = pathmaker.appPath(cave)
  log(opts, `configuring ${appPath}`)

  const launchType = upload.type === 'html' ? 'html' : 'native'
  globalMarket.saveEntity('caves', cave.id, {launchType})

  if (launchType === 'html') {
    const res = await html.configure(game, appPath)
    globalMarket.saveEntity('caves', cave.id, res)
  } else {
    const executables = (await configure(appPath)).executables
    globalMarket.saveEntity('caves', cave.id, {executables})
  }
}
