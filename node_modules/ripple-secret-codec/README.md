# ripple-secret-codec
Encodes/decodes Ripple secrets from/to hex or decimal seeds.

`ripple-secret-codec` is a node module for encoding and decoding Ripple secrets.  It's designed to be light-weight with a short, readable, auditable code-path and minimal external dependencies.  It can encode a Ripple secret from any 128-bit hex seed or positive decimal number below 2^128.  Numbers and secrets are expected to be supplied as strings.  No type or bounds checking is provided.  It's intended for educational purposes only and has no warranty.

There are just two external dependencies, chosen for concise code and minimal further dependencies:

`bignumber.js` A well-known module for handling large integers.  
`base-x` Ripple-authored base58 alphabet conversion, which in turn requires `safe-buffer`.  

(The `crypto` require is one of node's built-in modules. It's used for the sha256 function.)  

**Installation:**  
`npm install ripple-secret-codec`  

**API:**  
`encodeHex(<string: hex integer>)` Returns checksummed secret as a buffer, and Ripple secret in base58.  
`encodeDec(<string: dec integer>)` As above.  
`decodeHex(<string: ripple secret>)`  Returns checksummed secret as a buffer, and original seed in hex.  
`decodeDec(<string: ripple secret>)`  As above, with original seed in decimal.  

**Usage:**
```javascript
const rs_api = require('ripple-secret-codec')
const secret_from_hex_seed = rs_api.encodeHex('00')
const hex_seed_from_secret = rs_api.decodeHex('sp6JS7f14BuwFY8Mw6bTtLKWauoUs') // aka "Account ZERO"
```  

Hexadecimal integer seeds must be within the range: `0x00 - 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`  
Decimal integer seeds must be within the range: `0 - 340282366920938463463374607431768211455` (2^128-1)   

**Limitations:**  
Currently only ecdsa-secp256k1 Ripple secrets are supported.  A future release will include ed25519.
