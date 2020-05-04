const Bull = require('bull');

const LotsQueue = new Bull('lots', {
  limiter: {
    max: 100,
    duration: 1000,
  },
});


LotsQueue.process(async job => {
  job.progress(100);

  return true;
});

LotsQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
});

LotsQueue.on('global:completed', jobId => {
  console.log(`Job with id ${jobId} has been completed`);
});

module.exports = LotsQueue;
