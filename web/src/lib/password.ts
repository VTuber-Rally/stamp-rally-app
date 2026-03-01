export function generatePassword(length = 16) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  const values = new Uint32Array(length);

  window.crypto.getRandomValues(values);

  for (let i = 0; i < length; i++) {
    password += charset[values[i] % charset.length];
  }

  return password;
}
