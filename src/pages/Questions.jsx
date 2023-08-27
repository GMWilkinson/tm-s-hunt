import React, { useEffect, useState } from 'react'

import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'

import Spinner from 'react-bootstrap/Spinner'

import { getTeam } from '../api/getTeam'
import { getLocationData } from '../api/getLocationData'
import { updateCurrentQuestion } from '../api/updateCurrentQuestion'
import { setPenalty } from '../api/setPenalty'

const Questions = () => {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [allQuestions, setAllQuestions] = useState(null)
  const [team, setTeam] = useState(null)
  const [updateData, setUpdateData] = useState(false)
  const [showIncorrectComponent, setShowIncorrectComponent] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleModalClose = () => setShowModal(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const questions = await getLocationData()
      const currentTeam = await getTeam()
      setCurrentQuestion(questions[currentTeam.fields["current-question"]].fields)
      setAllQuestions(questions)
      console.log(questions.length)
      setTeam(currentTeam)
      setLoading(false)
      setUpdateData(false)
      console.log(currentTeam.fields["current-question"], questions.length)
    }
    fetchData()
    
  }, [updateData])
  
  const submitAnswer = async () => {
    const isCorrect = answer.toLowerCase().includes(currentQuestion.answer)
    if (true) {
      setAnswer('')
      setShowIncorrectComponent(false)
      await updateCurrentQuestion(team.fields["current-question"] + 1)
      setUpdateData(true)
      if (team.fields["current-question"] === allQuestions.length -1) {
        window.location.href = '/results'
        return
      }
    } else {
      await setPenalty(team.fields.penalties + 600000)
      setShowIncorrectComponent(true)
    }
  }

  const getClue = async () => {
    setLoading(true)
    await setPenalty(team.fields.penalties + 300000)
    setLoading(false)
    setShowModal(true)
  }

  return team && currentQuestion ? (
    <main 
      className="App"
      style={{
        backgroundImage: 
          currentQuestion.type === 'find' ? 
            `url(${`./stop-${currentQuestion.image}.png`})` : 
            `url(${'./tm-logo.png'})`,
        backgroundSize: "cover"
      }}
    >
      {loading ? (
        <Spinner animation="grow" />
      ) : (
        <>
          <Card className="mb-3" style={{backgroundColor: 'rgba(234, 235, 247, .95)'}}>
            {showIncorrectComponent ? (
              <>
                <Card.Header as="h5">Find the {team.fields["current-question"] === 0 ? 'first' : 'next'} location!</Card.Header>
                <Card.Body>
                  <Card.Title>Bad luck, remember there are clues to help if you need them</Card.Title>
                    <Button onClick={() => setShowIncorrectComponent(false)} variant="dark">Try again</Button>
                </Card.Body>
              </>
            ) : (
              <>
                {currentQuestion.type === 'location' ? (
                  <Card.Header as="h5">Find the {team.fields["current-question"] === 0 ? 'first' : 'next'} location!</Card.Header>
                ) : (
                  <Card.Header as="h5">{currentQuestion.name}! You will find the answer when you arrive</Card.Header>
                )}
                <Card.Body>
                  <Card.Text>{currentQuestion.question}</Card.Text>
                    <InputGroup className="mb-3">
                      <Form.Control aria-label="Team name" onChange={(e) => setAnswer(e.target.value)} />
                    </InputGroup>
                    <Button onClick={() => submitAnswer()} variant="dark">Submit</Button>
                </Card.Body>
              </>
            )}
            </Card>
          </>
      )}
      {!loading && currentQuestion.clue ? (
        <Button variant="danger" onClick={() => getClue()}>Give me a clue! 5 minute penalty</Button>
      ) : null}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentQuestion.clue}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  ) : null
}

export default Questions;
