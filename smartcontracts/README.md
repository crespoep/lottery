# Example scripts

### Create new lotteries:
``` bash
npx hardhat create-lottery --ticket 10000000000000000 --duration 300 --network localhost
```

``` bash
npx hardhat participate --lotteryid 1 --user <user-address> --ticket 10000000000000000
```

### Testing
The script "npm run test" will run a special configuration for mocha to suppress annoying logs that are fired in the console in the middle of tests.
The drawback is that this command doesn't compile the contracts, so it's preferable to use hardhat test command most of the time.
