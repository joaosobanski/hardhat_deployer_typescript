# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts

npx hardhat run scripts/deploy-name.ts --network mumbai

npx hardhat run scripts/deploy.ts --network mumbai
npx hardhat run scripts/deploy-usdt.ts --network mumbai

npx hardhat verify --contract "contracts/token/USDT.sol:USDT" --network mumbai 0x1F86B1D2a1b65B663F4AcAF881CD0AE979044Bd5

```

