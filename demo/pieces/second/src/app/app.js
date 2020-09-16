import React from 'react'

import './app.css'

const App = ({title, value}) => {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <h2 style={{ color: 'green'}}>{title}</h2>
      <pre className="pre-display">{value}</pre>
      <pre className="pre-display">{time.toISOString()}</pre>
    </>
  )
}

export default App
