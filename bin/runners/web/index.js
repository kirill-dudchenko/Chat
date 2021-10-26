const wsRunner = require('./ws')
const httpRunner = require('./http')
 
 const run = () => {
    wsRunner(httpRunner())
}
 
module.exports = run;