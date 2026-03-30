const DEFAULT_PASSWORD_LENGTH = 16
const DEFAULT_PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'

export function generatePassword(
  length = DEFAULT_PASSWORD_LENGTH,
  alphabet = DEFAULT_PASSWORD_ALPHABET,
) {
  const values = new Uint32Array(length)
  crypto.getRandomValues(values)

  return Array.from(values, (value) => {
    const index = value % alphabet.length
    return alphabet[index]
  }).join('')
}
