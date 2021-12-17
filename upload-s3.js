const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

console.log('works fine')

console.log(`_${argv.accessKey}_`)
console.log(argv.secretKey)