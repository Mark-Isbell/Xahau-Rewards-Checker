import fetch from 'node-fetch'
import { hookStateXLFtoBigNumber } from './xfl.mjs'

// Credits: https://github.com/tequdev/xahau-reward-claim/blob/main/src/app/ClaimReward.tsx

const account = 'ra7MQw7YoMjUw6thxmSGE6jpAEY3LTHxev'
const RPC_ENDPOINT = 'https://xahau.network'

const toUnixTimestamp = ts => ts + 946684800

const rpc = async req => {
  const call = await fetch(`${ RPC_ENDPOINT}`, { method: 'POST', body: JSON.stringify(req) }) ;
  const json = await call.json(); 
  return json?.result
}

const [
  { node: { HookStateData: RewardRate }, },
  { node: { HookStateData: RewardDelay }, },
  { account_data: { Balance: BalanceInDrops, RewardAccumulator: RewardAccumulatorHex, RewardLgrFirst, RewardLgrLast, RewardTime, PreviousTxnLgrSeq } },
  { ledger: { ledger_index: LedgerIndex, close_time: LastLedgerCloseTime } },
] = await Promise.all([
  rpc({ method: 'ledger_entry', params: [ { hook_state: { account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', key: '0000000000000000000000000000000000000000000000000000000000005252', /* RR */ namespace_id: '0000000000000000000000000000000000000000000000000000000000000000', }, }, ], }),
  rpc({ method: 'ledger_entry', params: [ { hook_state: { account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', key: '0000000000000000000000000000000000000000000000000000000000005244', /* RD */ namespace_id: '0000000000000000000000000000000000000000000000000000000000000000', }, }, ], }),
  rpc({ method: 'account_info', params: [ { account, }, ], }),
  rpc({ method: 'ledger', params: [ { ledger_index: 'validated', }, ], }),
])

console.log({ rewardDelay: hookStateXLFtoBigNumber(RewardDelay) })

const Balance = Number(BalanceInDrops) / 1000000
const TimeDiffSinceAdjustmentPeriodStart = LastLedgerCloseTime - RewardTime
const CanClaim = TimeDiffSinceAdjustmentPeriodStart >= hookStateXLFtoBigNumber(RewardDelay)
const RewardAccumulator = parseFloat(BigInt(`0x${RewardAccumulatorHex}`).toString())
const adjustmentInterval = hookStateXLFtoBigNumber(RewardDelay) / 60 / 60 / 24; 

console.log('Adjustment Rate (pct) per adjustment interval', hookStateXLFtoBigNumber(RewardRate))
console.log('Adjustment interval in days', hookStateXLFtoBigNumber(RewardDelay) / 60 / 60 / 24)
console.log('Last claim Timestamp', toUnixTimestamp(RewardTime))
console.log('Current ledger close Timestamp', toUnixTimestamp(LastLedgerCloseTime))
console.log('Claim diff (seconds) && claimable', TimeDiffSinceAdjustmentPeriodStart, CanClaim)

let accumulator = RewardAccumulator

const cur = LedgerIndex
const elapsed = cur - RewardLgrFirst
const elapsed_since_last = LedgerIndex - RewardLgrLast
const bal = Balance

if (bal > 0 && elapsed_since_last > 0) accumulator += bal * elapsed_since_last

const xfl_accum = accumulator
const xfl_elapsed = elapsed
let xfl_reward = xfl_accum / xfl_elapsed
xfl_reward = hookStateXLFtoBigNumber(RewardRate) * xfl_reward

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

console.log({
  toexpect_atsamebalance_atclaim: xfl_reward,
  buildup: 
    CanClaim
      ? xfl_reward
      : xfl_reward / hookStateXLFtoBigNumber(RewardDelay) * TimeDiffSinceAdjustmentPeriodStart,
      maxClaimDate: new Date().addDays(Math.floor(adjustmentInterval - (((xfl_reward / hookStateXLFtoBigNumber(RewardDelay) * TimeDiffSinceAdjustmentPeriodStart) / xfl_reward) * adjustmentInterval)))
})
