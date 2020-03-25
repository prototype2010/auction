const { test } = use('Test/Suite')('Code quality');
const { exec } = require('child_process');

test('lint test', async ({ assert }) => {
  const result = await new Promise((res) => {
    const childProcess = exec('npm run lint', (error, stdout) => {
      if (error && error.code) {
        /* if error will be returned - it prints stdout */
        /* eslint-disable-next-line */
        console.error(stdout);
      }
    });

    childProcess.on('exit', (code) => res(code));
  });

  assert.equal(result, 0);
}).timeout(0);
