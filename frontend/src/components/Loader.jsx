import './Loader.css'

export default function Loader({ message = 'Working on it...' }) {
  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="loader-ring" />
        <p className="loader-msg">{message}</p>
      </div>
    </div>
  )
}
