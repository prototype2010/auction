const Bull = require('bull');

const LotsQueue = new Bull('lots');

LotsQueue.process(async lot => console.log('####### LOT INFO', lot));

LotsQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
});

LotsQueue.on('global:completed', jobId => {
  console.log(`Job with id ${jobId} has been completed`);
});

module.exports = LotsQueue;
