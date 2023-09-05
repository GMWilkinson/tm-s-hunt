import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import Card from 'react-bootstrap/Card'

import Spinner from 'react-bootstrap/Spinner'

import { getTeam } from '../api/getTeam'
import { setFinishTime } from '../api/setFinishTime'

const Results = () => {
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState(null)
  const [time, setTime] = useState('') 
  const [timeWithPenalties, setTimeWithPenalties] = useState('') 
  const navigate = useNavigate()

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
      setLoading(true)
      const currentDate = new Date()
      const currentTime = currentDate.getTime()
      const currentTeam = await getTeam()
      if (currentTeam.fields["total-time"] !== 'unset') {
        localStorage.clear()
        navigate('/')
        return
      }
      await setFinishTime(currentTeam.fields["start-time"], currentTeam.fields.penalties)
      getDisplayTime(currentTime - currentTeam.fields["start-time"])
      getDisplayTimeWithPenalties((currentTime + currentTeam.fields.penalties) - currentTeam.fields["start-time"])
      setTeam(currentTeam)
      setLoading(false)
    }
    fetchData()
    
  }, [])

  return team ? (
    <main 
      className="App"
      style={{
        backgroundImage: `url(${`${process.env.PUBLIC_URL}/tm-logo.png`})`,
        backgroundSize: "cover"
      }}
    >
      {loading ? (
        <Spinner animation="grow" />
      ) : (
        <>
          <Card style={{backgroundColor: 'rgba(234, 235, 247, .95)', marginBottom: '16px'}}>
            <Card.Header as="h5">Congratz {team.fields.Name}! These are your times.</Card.Header>
            <Card.Body>
              <Card.Title>Time before penalties: {time}</Card.Title>
              <Card.Title>Time with penalties: {timeWithPenalties}</Card.Title>
            </Card.Body>
          </Card>
          <Card style={{backgroundColor: 'rgba(234, 235, 247, .95)'}}>
            <Card.Body>
              <Card.Title>Go into the Jack Horner & join the social committee for a drink</Card.Title>
              <Card.Text>Event Location: Cocktails in the City - Bedford Square Gardens, Bedford Square, WC1B 3DP</Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </main>
  ) : null
}

export default Results
