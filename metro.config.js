/* eslint-disable */

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');
//const blacklist = require('metro-config/src/defaults/blacklist');
const blacklist = require('metro').createBlacklist;

module.exports = (async () => {
    const {
        resolver: {
            sourceExts,
            assetExts
        }
    } = await getDefaultConfig();

    return {
        transformer: {
            //blacklistRE: blacklist([/#current-cloud-backend\/.*/]),
            babelTransformerPath: require.resolve('react-native-svg-transformer'),
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: false,
                },
            }),
        },
        resolver: {
            blacklistRE: blacklist([/#current-cloud-backend\/.*/]),
            assetExts: assetExts.filter(ext => ext !== 'svg'),
            sourceExts: [...sourceExts, 'svg']
        }
    }
})();
