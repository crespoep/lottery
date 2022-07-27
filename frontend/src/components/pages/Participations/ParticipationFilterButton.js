
const ParticipationFilterButton = ({ won, setWon }) => {
  return (
    <div className="flex justify-end text-black font-bold ml-auto w-fit">
      <div
        className={`rounded-l-2xl text-white p-2 w-20 text-center + ${won ? "bg-zinc-800" : "bg-light-green"}`}
        onClick={() => setWon(false)}
      >
        Lost
      </div>
      <div
        className={`rounded-r-2xl text-white p-2 w-20 text-center + ${won ? "bg-light-green" : "bg-zinc-800"}`}
        onClick={() => setWon(true)}
      >
        Won
      </div>
    </div>
  )
}

export default ParticipationFilterButton;
