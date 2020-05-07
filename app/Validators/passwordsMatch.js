
const passwordsMatch = async (data, field, message, args, get) => {
  const password = +get(data, 'password');
  const repeatPassword = +get(data, 'repeatPassword');

  if (password < repeatPassword) {
    throw new Error('Passwords do not match');
  }

  return true;
};

module.exports = { passwordsMatch };
