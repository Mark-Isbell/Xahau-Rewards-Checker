// https://github.com/tequdev/xahau-reward-claim/blob/main/src/lib/xahau/xfl.ts

export function get_exponent(xfl) {
    if (xfl < 0n)
      throw "Invalid XFL"
    if (xfl == 0n)
      return 0n
    return ((xfl >> 54n) & 0xFFn) - 97n
  }
  
  export function get_mantissa(xfl) {
    if (xfl < 0n)
      throw "Invalid XFL"
    if (xfl == 0n)
      return 0n
    return xfl - ((xfl >> 54n) << 54n)
  }
  
  export function is_negative(xfl) {
    if (xfl < 0n)
      throw "Invalid XFL"
    if (xfl == 0n)
      return false
    return ((xfl >> 62n) & 1n) == 0n
  }
  
  export function to_string(xfl) {
    if (xfl < 0n)
      throw "Invalid XFL"
    if (xfl == 0n)
      return "<zero>"
    return (is_negative(xfl) ? "-" : "+") + get_mantissa(xfl).toString() + "E" + get_exponent(xfl).toString()
  }
  
  export const xflToFloat = xfl => parseFloat(to_string(xfl))
  export const changeEndianness = str => str.match(/[a-f0-9]{2}/ig).reverse().join('')
  export const hookStateXLFtoBigNumber = (stateData) => xflToFloat(BigInt(`0x${changeEndianness(stateData)}`))
  