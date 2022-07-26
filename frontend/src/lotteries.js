const { utils } = require("ethers")

export const lotteries = [
  {
    id: 1 ,
    payment: utils.parseEther("0.1"),
    jackpot: utils.parseEther("0.2"),
    participants: [
      '0x9994cc6877d0a9ccec1f2daa1b060ecaa8a0000f',
      '0x3334cc6877d0a9ccec1f2daa1b060ecaa8a0000f'
    ],
    endTime: (new Date()).getTime(),
    state: 0
  },
  {
    id: 2,
    payment: utils.parseEther("1"),
    jackpot: 0,
    participants: [],
    endTime: (new Date()).getTime(),
    state: 0
  }
]
