import React, { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'

import Spinner from 'react-bootstrap/Spinner'

import { getTeam } from '../api/getTeam'
import { setFinishTime } from '../api/setFinishTime'

const Results = () => {
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState(null)
  const [time, setTime] = useState('') 
  const [timeWithPenalties, setTimeWithPenalties] = useState('') 

  const getDisplayTime = (score) => {
    const minutes = Math.floor(score / 60000)
    setTime(minutes + " minutes")
  }

  const getDisplayTimeWithPenalties = (score) => {
    const minutes = Math.floor(score / 60000)
    setTimeWithPenalties(minutes + " minutes")
  }

  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem('score-saved') === 'saved') {
        localStorage.clear()
        window.location.href = '/'
      }
      setLoading(true)
      const currentDate = new Date()
      const currentTime = currentDate.getTime()
      const currentTeam = await getTeam()
      await setFinishTime(currentTeam.fields["start-time"], currentTeam.fields.penalties)
      getDisplayTime(currentTime - currentTeam.fields["start-time"])
      getDisplayTimeWithPenalties((currentTime + currentTeam.fields.penalties) - currentTeam.fields["start-time"])
      setTeam(currentTeam)
      setLoading(false)
      localStorage.setItem('score-saved', 'saved')
    }
    fetchData()
    
  }, [])

  return team ? (
    <main 
      className="App"
      style={{
        backgroundImage: `url(${'./tm-logo.png'})`,
        backgroundSize: "cover"
      }}
    >
      {loading ? (
        <Spinner animation="grow" />
      ) : (
        <Card style={{backgroundColor: 'rgba(234, 235, 247, .95)'}}>
            <Card.Header as="h5">Results for {team.fields.Name}</Card.Header>
            <Card.Body>
              <Card.Title>Time before penalties: {time}</Card.Title>
              <Card.Title>Time with penalties: {timeWithPenalties}</Card.Title>
            </Card.Body>
          </Card>
      )}
    </main>
  ) : null
}

export default Results
