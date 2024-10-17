# Xahau-Rewards-Checker
JS program that checks the buildup of monthly Xahau rewards and provides next (approximate) date to claim the maximum balance

# Credit To Original Developers
99% of this code is from the original developers: I added an approximate date for a user to execute the next claim reward. 

Original devs:  
https://github.com/tequdev/xahau-reward-claim/blob/main/src/lib/xahau/xfl.ts
https://gist.github.com/WietseWind/c80054639f72a677012073efe25954ba 

# Requirements 
Install Node 

# Installation
npm install

# Pre-requisite
Program only works on accounts that have already 'opted in' to receive the claim reward by initiating at least one claim reward transaction. 
That program can be found here:  https://github.com/Mark-Isbell/xahau-claim-rewards-nodejs 

# Instructions 
Customize "account" variable in index.mjs to your specific wallet 'r-address'.

# Warning 
The date provided is approximate, and uses a 'floor' value to access the nearest day.  

# Further Information
To learn more about the Xahau Claim Reward: https://docs.xahau.network/technical/protocol-reference/transactions/transaction-types/claimreward 


