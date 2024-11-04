// Learn more https://docs.expo.dev/guides/monorepos
// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config')}
 */
const { getDefaultConfig } = require('@expo/metro-config')
const path = require('node:path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot]

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// 3. Force Metro to resolve (sub)dependencies only from `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true

// 4. Read the `exports` field, instead of just `main`, in package.json
config.resolver.unstable_enablePackageExports = true

config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    const result = context.resolveRequest(context, moduleName, platform)
    return result
  } catch (e) {
    console.log('========================================')
    console.log('resolving', moduleName, platform, context.enablePackageExports)
    console.log('ERR', e)
    console.log('========================================')
    throw e
  }
}

config.transformer = { ...config.transformer, unstable_allowRequireContext: true }
config.transformer.minifierPath = require.resolve('metro-minify-terser')

module.exports = config
