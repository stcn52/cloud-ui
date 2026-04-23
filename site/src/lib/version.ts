import libPkg from '../../../package.json'

export const LIB_VERSION = (libPkg as { version: string }).version
export const LIB_VERSION_TAG = `v${LIB_VERSION}`
