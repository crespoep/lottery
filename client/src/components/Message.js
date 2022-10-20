const Message = ({message, color}) => (
  <div
    className={`bg-back-black text-white my-5 border-2 shadow-lg shadow-${color} border-${color} rounded-2xl p-4`}
  >
    <p>{message}</p>
  </div>
);

export default Message;
