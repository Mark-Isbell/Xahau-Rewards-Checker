// ripple-secret-codec v1.0 github.com/professorhantzen/ripple-secret-codec
// Encodes/decodes Ripple secrets to and from hexadecimal or decimal seeds.
// NO WARRANTY EXPRESSED/IMPLIED, USE AT OWN RISK, NO RESPONSIBILITY TAKEN.
// npm i ripple-secret-codec; const rs_api = require('ripple-secret-codec')
// const secret_from_hex_seed = rs_api.encodeHex('<string: hex int. seed>')
// const secret_from_dec_seed = rs_api.encodeDec('<string: dec int. seed>')
// const hex_seed_from_secret = rs_api.decodeHex('<string: ripple secret>')
// const dec_seed_from_secret = rs_api.decodeDec('<string: ripple secret>')
// Hex int. seeds within range: 0x0000 - 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
// Dec int. seeds within range: 0 - 340282366920938463463374607431768211455

const alphab = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
const base58 = require('base-x')(alphab)
const bignum = require('bignumber.js')
const crypto = require('crypto')
const sha256 = (data) => { return crypto.createHash('sha256').update(data).digest() }
const prefix = Buffer.from([33])
const pad128 = '0000000000000000000000000000000000000000' // zero pad for hex input and dec output

function encodeHex(r_seed_hex){
	const p_seed_hex = Buffer.concat([prefix, Buffer.from((pad128 + r_seed_hex.toString(16)).substr(-32), 'hex')])
	const chksum_hex = sha256(sha256(p_seed_hex)).slice(0,4)
	const secret_hex = Buffer.concat([p_seed_hex, chksum_hex])
	const secret_b58 = base58.encode(secret_hex)
	return { secret_hex, secret_b58 }
}

function decodeHex(secret_b58){
	const secret_hex = Buffer.from(base58.decode(secret_b58))
	const chksum_hex = secret_hex.slice(-4)
	const r_seed_hex = secret_hex.slice(1,17).toString('hex')
	return { secret_hex, r_seed_hex }
}

function encodeDec(r_seed_dec){
	const big_decnum = new bignum(r_seed_dec)
	const r_seed_hex = big_decnum.toString(16)
	return encodeHex(r_seed_hex)
}

function decodeDec(secret_b58){
	const decode_obj = decodeHex(secret_b58)
	const secret_hex = decode_obj.secret_hex
	const r_seed_hex = decode_obj.r_seed_hex
	const bignum_dec = new bignum(r_seed_hex, 16)
	const r_seed_dec = (pad128 + bignum_dec.toString(10)).substr(-39)
	return { secret_hex, r_seed_dec }
}

module.exports = { encodeHex, decodeHex, encodeDec, decodeDec }
