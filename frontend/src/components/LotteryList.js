import {lotteries} from "../lotteries";

const LotteryList = () => {

  return (
    <div>
      <h2>Available lotteries</h2>
      <div>
        {
          lotteries.map(
            lottery =>
              <div key={lottery.id}>
                { lottery.id }
              </div>
            )
        }
      </div>
    </div>
  )
}

export default LotteryList


