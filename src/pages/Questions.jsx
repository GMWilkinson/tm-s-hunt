import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

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
  const [loading, setLoading] = useState(false)
  const [correctLoading, setCorrectLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [allQuestions, setAllQuestions] = useState(null)
  const [team, setTeam] = useState(null)
  const [updateData, setUpdateData] = useState(false)
  const [showIncorrectComponent, setShowIncorrectComponent] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleModalClose = () => setShowModal(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const questions = await getLocationData()
      const currentTeam = await getTeam()
      setCurrentQuestion(questions[currentTeam.fields["current-question"]].fields)
      setAllQuestions(questions)
      setTeam(currentTeam)
      setLoading(false)
      setCorrectLoading(false)
      setUpdateData(false)
    }
    fetchData()
    
  }, [updateData])
  
  const submitAnswer = async () => {
    const isCorrect = answer.toLowerCase().includes(currentQuestion.answer)
    if (isCorrect) {
      setCorrectLoading(true)
      setAnswer('')
      setShowIncorrectComponent(false)
      await updateCurrentQuestion(team.fields["current-question"] + 1)
      if (team.fields["current-question"] === allQuestions.length -1) {
        navigate('/results')
        return
      }
      setUpdateData(true)
    } else {
      setLoading(true)
      await setPenalty(team.fields.penalties + 600000)
      setLoading(false)
      setShowIncorrectComponent(true)
    }
  }

  const skipQuestion = async () => {
    setAnswer('')
    await updateCurrentQuestion(team.fields["current-question"] + 1)
    await setPenalty(team.fields.penalties + 1200000)
    if (team.fields["current-question"] === allQuestions.length -1) {
      navigate('/results')
      return
    }
    setUpdateData(true)
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
            `url(${`${process.env.PUBLIC_URL}/stop-${currentQuestion.image}.png`})` : 
            `url(${`${process.env.PUBLIC_URL}/tm-logo.png`})`,
        backgroundSize: "cover"
      }}
    >
      {loading ? (
        <span>
          <Spinner animation="grow" title='Correct ✓' />
          {correctLoading ? (
            <div 
              style={{
                padding: '8px 16px 4px', 
                backgroundColor: 'forestgreen',
                borderRadius: '8px'
              }}>
              <h1 style={{fontWeight: 'bold', fontSize: '40px'}}>✓ Correct...</h1>
            </div>
          ) : null}
        </span>
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
                  <Card.Header as="h5">Find the {team.fields["current-question"] === 0 ? 'first' : 'next'} location! Remember, Google is your friend</Card.Header>
                ) : (
                  <Card.Header as="h5">{currentQuestion.name} - {currentQuestion.postcode}! You will find the answer when you arrive</Card.Header>
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
      {!loading && currentQuestion.clue && !showIncorrectComponent ? (
        <Button className='mb-3' variant="success" onClick={() => getClue()}>Give me a clue! 5 minute penalty</Button>
      ) : null}
      {!loading && !showIncorrectComponent ? (
        <Button variant="danger" onClick={() => skipQuestion()}>Skip (20 minute penalty)</Button>
      ) : null}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Clue!!</Modal.Title>
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
