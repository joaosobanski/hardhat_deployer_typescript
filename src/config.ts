

import Config from '../config.json'

function getConfig(chainId: Number) {
    return Config.find(e => e.chainId == chainId)
}

export default getConfig