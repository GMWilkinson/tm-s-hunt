import React, { useState } from 'react'

import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Spinner from 'react-bootstrap/Spinner'

import { createNewTeam } from '../api/createNewTeam'
import { setStartTime } from '../api/setStartTime'

const Landing = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [nameIsSet, setNameIsSet] = useState(false)

  const createTeam = async () => {
    setLoading(true)
    await createNewTeam(name)
    setLoading(false)
    setNameIsSet(true)
  }

  const startGame = async () => {
    await setStartTime()
    window.location.href = '/questions'
  }

  return (
    <main className="App">
      <Card>
        <Card.Header as="h5">Are you ready?</Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="grow" />
          ) : (
            <>
              <Card.Title>{nameIsSet ? `Go on ${name}!` : 'Enter a team name'}</Card.Title>
              {!nameIsSet ? (
                <InputGroup className="mb-3">
                  <Form.Control aria-label="Team name" onChange={(e) => setName(e.target.value)} />
                  <Button disabled={name.length < 2} onClick={() => createTeam()} variant="primary">Done</Button>
                </InputGroup>
              ) : null}
              {nameIsSet ? (
                <>
                  <Card.Text>When you click "Start" the timer will begin. Fastest time wins!</Card.Text>
                  <Card.Text>You can use a clue if you get stuck but these will add time to your score</Card.Text>
                  <Button disabled={!nameIsSet} onClick={() => startGame()} variant="primary">Start</Button>
                </>
              ) : null}
            </>
          )}
        </Card.Body>
      </Card>
    </main>
  )
}

export default Landing
