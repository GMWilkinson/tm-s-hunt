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

  const getTime = (score) => {
    const minutes = Math.floor(score / 60000)
    const seconds = ((score % 60000) / 1000).toFixed(0)
    setTime(minutes + ":" + (seconds < 10 ? '0' : '') + seconds)
  }

  const getTimeWithPenalties = (score) => {
    const minutes = Math.floor(score / 60000)
    const seconds = ((score % 60000) / 1000).toFixed(0)
    setTimeWithPenalties(minutes + ":" + (seconds < 10 ? '0' : '') + seconds)
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const currentTeam = await getTeam()
      await setFinishTime(currentTeam.fields["start-time"], currentTeam.fields.penalties)
      getTime(currentTeam.fields["finish-time"] - currentTeam.fields["start-time"])
      getTimeWithPenalties((currentTeam.fields["finish-time"] + currentTeam.fields.penalties) - currentTeam.fields["start-time"])
      setTeam(currentTeam)
      setLoading(false)
    }
    fetchData()
    
  }, [])

  return team ? (
    <main className="App">
      {loading ? (
        <Spinner animation="grow" />
      ) : (
        <Card className="mb-3">
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
