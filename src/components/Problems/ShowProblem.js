import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Popover, OverlayTrigger } from "react-bootstrap"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'

import moment from 'moment'

import { destroyProblem } from '../../api/problems'
import { getProbAnswers, postAnswer } from '../../api/answers'

import NewAnswer from '../Answers/NewAnswer'
import ShowAnswer from '../Answers/ShowAnswer'
import EditProblem from './EditProblem'

function ShowProblem(props) {

    const [newSolution, setNewSolution] = useState('')
    const [probAnswers, setProbAnswers] = useState([])
    const [modalShow, setModalShow] = useState(false)

    const { pathname } = useLocation()
    const problemId = pathname.split('/')[2]
    // console.log('this is the problem id:', problemId)
    let currentProblem = props.problems && props.problems.find(x => x._id == problemId)
    console.log('this is the current problem\n', currentProblem)
    let lastNameInit = currentProblem && currentProblem.owner.lastName.charAt(0)

    let modules = {
        syntax: true,
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    }

    const navigate = useNavigate()

    // helper method attached to delete button
    const deleteProblem = () => {
        // axios call to delete problem from db
        destroyProblem(props.user, currentProblem._id)
            // console.log('THIS IS:', `${apiUrl}/problems/${itemId}`)
            .then(() => {
                props.refreshProblems()
                navigate('/problems')
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(() => {
        // axios call to find all answers connected to current problem's id
        getProbAnswers(currentProblem._id)
            .then(answers => {
                console.log('these are all the problems answers\n', answers.data.foundAnswers)
                // set the found answers in db to state
                setProbAnswers(answers.data.foundAnswers || [])
            })
            .catch(err => console.error(err))
    }, [])

    // refresh answers to include posted and updated answers
    const refreshProbAnswers = () => {
        getProbAnswers(currentProblem._id)
            .then(answers => {
                console.log('these are all the problems answers\n', answers.data.foundAnswers)
                setProbAnswers(answers.data.foundAnswers)
            })
            .catch(err => console.error(err))
    }

    // display them from newest to oldest
    const getAllProbAnswers = probAnswers.reverse().map((answer, i) => {
        return (
            <li key={i}>
                <ShowAnswer
                    answer={answer}
                    key={i}
                    currentProblemId={currentProblem._id}
                    refreshProbAnswers={refreshProbAnswers}
                    currentUser={props.user}
                />
            </li>
        )
    })

    // passed down as a prop to NewAnswer
    const handleAnswerChange = (e) => {
        setNewSolution({ ...newSolution, [e.target.name]: e.target.value })
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Are you sure?</Popover.Header>
            <Popover.Body>
                <Button variant='danger' size='sm' onClick={() => deleteProblem(props.user, currentProblem._id)}>Confirm Delete</Button>
            </Popover.Body>
        </Popover>
    );

    const DeletePopover = () => (
        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button size='sm' variant="danger">Delete</Button>
        </OverlayTrigger>
    );

    return (
        <>
            {!currentProblem ? <h1>Loading...</h1> : (
                <container>
                    {/* <----- CURRENT PROBLEM JUMBOTRON -----> */}
                    <header class='container-fluid bg-dark text-light p-5'>
                        <div id='problemHeader'>
                            <h3 class='mb-3'>{currentProblem.title}</h3>
                            <div>
                                {props.user && props.user._id == currentProblem.owner._id &&
                                    // <----- EDIT/DELETE BUTTONS -----> //
                                    <div id='showProblemBtn'>
                                        <Button id='cardBtn' size='sm' onClick={() => setModalShow(true)}>Edit Problem</Button>
                                        <EditProblem
                                            show={modalShow}
                                            onHide={() => setModalShow(false)}
                                            currentProb={currentProblem}
                                            currUser={props.user}
                                            refreshProb={props.refreshProblems}
                                        />
                                        {/* <Button className="mr-1" variant="danger" size='sm' onClick={() => deleteProblem(props.user, currentProblem._id)}>Delete</Button> */}
                                        <DeletePopover />
                                    </div>
                                }
                            </div>
                        </div>
                        <div style={{ width: '1000px', 'background-color': "#212529" }} className='mx-4 my-3'>
                            <ReactQuill
                                value={currentProblem.description}
                                readOnly={true}
                                theme={"bubble"}
                                modules={modules}
                            />
                        </div>
                        <small className='name'>Asked by: {currentProblem.owner.firstName} {lastNameInit}.</small>
                        <span id="showProblemPill" class='badge rounded-pill'> {moment(currentProblem.createdAt).fromNow()} </span>
                    </header>
                    {/* <----- NEW ANSWER -----> */}
                    <div id='newAnswerContainer' style={{ 'max-width': '75%' }}>
                        <NewAnswer
                            user={props.user}
                            currentProblem={currentProblem}
                            refreshProbAnswers={refreshProbAnswers}
                        />
                        <hr />
                        <ol>
                            {getAllProbAnswers}
                        </ol>
                    </div>
                </container>
            )}
        </>
    )
}
export default ShowProblem