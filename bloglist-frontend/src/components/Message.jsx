const Message = ({ message }) => <div data-testid="notification" className={`message ${message[1]}`}>{message[0]}</div>

export default Message