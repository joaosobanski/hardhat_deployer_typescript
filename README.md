# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts

npx hardhat run scripts/deploy.ts --network mumbai
npx hardhat run scripts/deploy-usdt.ts --network mumbai

npx hardhat verify 0x8C5C5d7Cef843fE4C905DB1681DAA343B2b89bC4 --network mumbai 1685794753

npx hardhat verify --contract "contracts/token/USDT.sol:USDT" --network mumbai 0x5F6F2F7f799B753a695DCa937fd99642DDBAb561

```

