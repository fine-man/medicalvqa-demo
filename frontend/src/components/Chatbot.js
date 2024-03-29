import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import Breadcrumbs from './breadcrumbs';
import { Modal, Form } from 'react-bootstrap';

import subpath from './subpath';
import data from './data.json';
import { useTheme } from '@mui/material/styles';
import config from './config';

const ip_addr = "10.2.138.43"

const Chatbot = ({ selectedImage }) => {

  const module = decodeURIComponent(window.location.href.split("/")[4])
  console.log(module, "module");
  const theme = useTheme();
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const suggestion = useRef(null);
  const empty = useRef([]);
  // const askedQuestion = useRef(false);
  const [askedQuestion, setAskedQuestion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [isRecording, setIsRecording] = useState(false);

  const toggleButtonStyle = {
    position: 'relative',
    top: '-55rem',
    left: '90rem',
    color: '#F0EAD6',
    display: 'flex',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    // alignItems: 'center',
    // textAlign: 'center',
    border: '2px solid grey',
    // padding: '1rem',
    fontSize: '1.5rem',
    borderRadius: '0.45rem',
    fontFamily: '"Bebas Neue", sans-serif',
    backgroundColor: 'rgb(61, 72, 73)',
    height: '4rem',
    zIndex: '10000',
  }

  const toggleButtonStyle2 = {
    position: 'relative',
    top: '-54rem',
    left: '90rem',
    color: '#F0EAD6',
    display: 'flex',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    // alignItems: 'center',
    // textAlign: 'center',
    border: '2px solid grey',
    // padding: '1rem',
    fontSize: '1.5rem',
    borderRadius: '7px',
    fontFamily: '"Bebas Neue", sans-serif',
    backgroundColor: 'rgb(61, 72, 73)',
    height: '4rem',
    zIndex: '10000',
  }

  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');


  const goToEditImage = () => {
    //  '/' + module + '/edit' + '#' + localStorage.getItem('selectedImageId') + ';;;'
    window.location.href = `${subpath}` + '/' + module + '/edit' + '#' + localStorage.getItem('selectedImageId') + ';;;'
  }

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    // setShowModal(false);
    setShowModal(false);
    setQuestion('');
    setAnswer('');
  }

  const addQNA = () => {
    const selectedImageId = localStorage.getItem('selectedImageId');
    const newQNA = {
      questionText: question,
      answerText: answer,
    };
    const url = `${config.backendUrl}/api/image/` + selectedImageId + '/addquestion';
    const token = localStorage.getItem('token');
    const addingQNA = async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(newQNA),
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions([...questions, question]);
        setAnswers([...answers, answer]);
      }
    };
    addingQNA();
    setQuestion('');
    setAnswer('');
    setShowModal(false);
  }

  // const recognition = new window.webkitSpeechRecognition();

  // var transcript = '';

  // const handleSpeechRecognition = () => {
  //   // toggleRecording();
  //   const redDot = document.getElementById('redDot');
  //   // if (!isRecording) {
  //   //   redDot.style.display = 'block';
  //   //   recognition.onstart = () => {
  //   //     setIsRecording(true);
  //   //   };

  //   //   recognition.onresult = (event) => {
  //   //     transcript = event.results[0][0].transcript;
  //   //   };

  //   //   recognition.onend = () => {
  //   //     handleSendQuestion();
  //   //     setIsRecording(false);
  //   //   };

  //   //   recognition.start();
  //   // } else {
  //   //   redDot.style.display = 'none';
  //   //   recognition.stop();
  //   // }
  // };

  // read the selected image from the local storage when the page loads
  useEffect(() => {
    selectedImage.current = localStorage.getItem('selectedImage');
    // getting all the questions and answers of the selected image

    const selectedImageId = localStorage.getItem('selectedImageId');
    const url = `${config.backendUrl}/api/image/` + selectedImageId + '/questions';
    const token = localStorage.getItem('token');

    const getQuestions = async () => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data, "dtaa");
        const qs = []
        const ans = []
        for (var i = 0; i < data.questions.length; i++) {
          qs.push(data.questions[i].questionText);
          ans.push(data.questions[i].answerText);
        }
        setQuestions(qs);
        setAnswers(ans);
      } else {
        console.log('error in getting the images');
      }
    }
    getQuestions();

  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendQuestion = async (e) => {
    console.log('handleSendQuestion was called');
    setAskedQuestion(true)
    setIsVisible(true);
    let userQuestion = userInput.toLowerCase();
    if (e && e.target.innerText != 'SEND') {
      userQuestion = e.target.innerText.toLowerCase();
    }
    // if (transcript) {
    //   setUserInput(transcript);
    //   userQuestion = transcript.toLowerCase();
    // }
    console.log(userQuestion, 'userQuestion');
    // need to convert /static/media/image2.1b96c51f8712b2e9ac56.png into image2.png
    var imageName = ''
    var imageId = ''
    var imageIdWithExtension = ''
    if (localStorage.getItem('selectedImage') === null) {
      // set the bot respnse to please select an image first
      const errorMessage = {
        id: chatMessages.length + 1,
        message: 'Please select an image first.',
        isUser: false,
      };
    }
    else {
      imageName = localStorage.getItem('selectedImage')
      // imageId = imageName.split('.')[0];
      // now joining it with the imageName.split('.')[2]
      // imageIdWithExtension = imageName.split('/').pop().split('.')[0] + '.' + imageName.split('/').pop().split('.')[2];
      imageIdWithExtension = imageName
    }
    console.log(localStorage.getItem('selectedImage'), 'imageIdWithExtension');



    // const keywordExtractor = require("keyword-extractor");

    // const text = "This is an example sentence, and we want to extract important keywords from it.";
    // const keywords = keywordExtractor.extract(userQuestion, {
    //   language: "english",
    //   remove_digits: true,
    //   return_changed_case: true,
    //   // remove_duplicates: true,
    // });
    // // converting the keywords array into a string
    // var keywordsString = keywords.join(" ");
    // console.log(keywordsString, "the keywords");

    const url = `${config.backendUrl}/api/flask/get_closest_question`;
    console.log(`Chatbot.js: url: ${url}`)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: localStorage.getItem('token'), question: userQuestion, selectedImageId: localStorage.getItem('selectedImageId') }),
    });

    // const response = await fetch('https://nicemedvqa.onrender.com/api/answer', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ question: keywordsString, selectedImage: imageIdWithExtension }),
    // });
    // console.log("response recieved");

    if (response.ok) {
      const data = await response.json();
      console.log(data, "data");

      if (data.closest_question == null || data.closest_question == undefined) {
        const errorMessage = {
          id: chatMessages.length + 1,
          message: "Please add a question for the selected image.",
          isUser: false,
        };

        setChatMessages([...chatMessages, errorMessage]);
        setUserInput('');
        return;
      }
      
      const answer = data.closest_question.answerText;

      const newMessage = {
        id: chatMessages.length + 1,
        message: userQuestion,
        isUser: true,
      };

      if (answer) {
        const botAnswer = {
          id: chatMessages.length + 2,
          message: answer,
          isUser: false,
        };

        setChatMessages([...chatMessages, newMessage, botAnswer]);
      } else {
        const errorMessage = {
          id: chatMessages.length + 2,
          message: "I'm sorry, I don't have an answer to that question for the selected image.",
          isUser: false,
        };

        setChatMessages([...chatMessages, newMessage, errorMessage]);
      }
    }

    setUserInput('');
  };

  const getSuggestionQuestion = (num) => {
    var actualImage = ''
    var suggestions = []
    const dataLength = Object.keys(data.images).length;
    if (localStorage.getItem('selectedImage') === null) {
      return '';
    }
    // const imageName2 = localStorage.getItem('selectedImage').toString();
    // actualImage = imageName2.split('/').pop().split('.')[0] + '.' + imageName2.split('/').pop().split('.')[2];
    // for (var i = 0; i < dataLength; i++) {
    //   if (data.images[i].image === actualImage) {
    //     for (var j = 0; j < data.images[i].questions.length; j++) {
    //       suggestions.push(data.images[i].questions[j].question);
    //     }
    //     break;
    //   }
    // }
    if (questions && questions.length > 0) {
      return questions[num];
    }
    return '';
  };

  const gridItem = {
    width: '20rem',
    fontSize: "1rem",
    textAlign: "center",
    backgroundColor: "#3D4849",
    color: '#F0EAD6',
    // border: "4px solid rgb(26 94 170)",
  }
  const gridItem2 = {
    width: '20rem',

    fontSize: "1rem",
    textAlign: "center",
    backgroundColor: "#2f3738",
    color: '#F0EAD6',
    // border: "4px solid rgb(26 94 170)",
  }

  return (
    <>
      <div className='outer-full' style={{
        width: '100%',
        height: '60rem',
        backgroundColor: '#3D4849',
      }}>
        <Breadcrumbs />
        <Box style={{
          // opacity: chatbotShow ? 1 : 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '4rem',
          paddingLeft: isVisible ? '1rem' : '1rem',
          transition: 'opacity 1s ease-in-out',
          width: '120rem',
          height: '62.5rem',
          backgroundColor: '#3D4849',
          paddingTop: '1rem',
        }}>

          {/* Side component */}
          <Box style={{
            // display: isVisible ? 'flex' : 'none',
            opacity: isVisible ? 1 : 0,
            display: 'none',
            transition: 'opacity 2s ease-in-out',
            // position: 'relative',
            // left: '2rem',
            // top: '10rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // position: 'fixed',
            width: '25rem',
          }}>
            <Box style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography style={{
                textAlign: 'center',
                color: '#F0EAD6',
                marginBottom: '1rem',
              }} variant="h4">Selected Image</Typography>

              <img src={localStorage.getItem('selectedImage')} style={{
                margin: 'auto',
                maxWidth: "95%",
                maxHeight: "95%",
                borderRadius: "10px",
              }} />
            </Box>

            {/* the questions */}
            <Box style={{
              marginTop: "5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <Box style={{
                // maxWidth: '100%',
                width: '20rem',
              }}>
                <Button
                  variant="contained"
                  onClick={(askedQuestion == true) ? handleSendQuestion : null}

                  style={gridItem2}
                >{getSuggestionQuestion(4) === '' || getSuggestionQuestion(4) === undefined ? 'Please Add a Question' : getSuggestionQuestion(4)}
                </Button>
              </Box>
              <Box style={{
                maxWidth: '100%'
              }}>
                <Button
                  variant="contained"
                  onClick={(askedQuestion == true) ? handleSendQuestion : null}
                  style={gridItem2}
                >{getSuggestionQuestion(5) === '' || getSuggestionQuestion(5) === undefined ? 'Please Add a Question' : getSuggestionQuestion(5)}
                </Button>
              </Box>
              <Box style={{
                maxWidth: '100%'
              }}>
                <Button
                  variant="contained"
                  onClick={(askedQuestion == true) ? handleSendQuestion : null}

                  style={gridItem2}
                >{getSuggestionQuestion(6) === '' || getSuggestionQuestion(6) === undefined ? 'Please Add a Question' : getSuggestionQuestion(6)}
                </Button>
              </Box>
              <Box style={{
                maxWidth: '100%'
              }}>
                <Button
                  variant="contained"
                  onClick={(askedQuestion == true) ? handleSendQuestion : null}

                  style={gridItem2}
                >{getSuggestionQuestion(7) === '' || getSuggestionQuestion(7) === undefined ? 'Please Add a Question' : getSuggestionQuestion(7)}
                </Button>
              </Box>
            </Box>


          </Box>


          {/* Main component */}

          <Paper
            sx={{
              // overflowX: 'hidden',
              // position: 'absolute',
              // top: '4rem',
              // left: '33rem',
              height: '55rem',
              width: '50rem',
              backgroundColor: '#2f3738',
            }}
            elevation={3}
          >
            {askedQuestion == false ?
              <>

                {/* a Box to contain four suggestion questions in boxes */}
                <Typography style={{
                  // maxHeight: '100rem',
                  height: '45rem',
                  overflowY: 'auto',
                  // marginBottom: '1rem',
                  padding: '0rem',
                }}>
                  <Typography style={{
                    textAlign: 'center',
                    color: '#F0EAD6',
                    marginTop: '2rem',
                    fontFamily: '"Bebas Neue", sans-serif',
                    letterSpacing: '0.125rem',
                  }} variant="h3">KREST Fetal Radiology Image Bank for Personalized Learning</Typography>


                  {/* Placing an image here */}
                  <Box style={{
                    marginTop: "3rem",
                    textAlign: "center",
                    borderRadius: "10px",
                  }}>
                    <img src={localStorage.getItem('selectedImage')} style={{
                      maxWidth: "20rem",
                      maxHeight: "20rem",
                      borderRadius: "10px",
                    }} />
                  </Box>


                  <Typography variant='h4' style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    color: '#F0EAD6',
                    fontFamily: '"Bebas Neue", sans-serif',
                  }}>Select or type in a question</Typography>
                  <Box style={{
                    marginTop: "2rem",
                    textAlign: "center",
                    display: "grid",
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: "1rem",
                  }}>
                    <Box>
                      <Button
                        variant="contained"
                        onClick={handleSendQuestion}
                        style={gridItem}
                      >{getSuggestionQuestion(0) === '' || getSuggestionQuestion(0) === undefined ? 'Please Add a Question' : getSuggestionQuestion(0)}
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        onClick={handleSendQuestion}
                        style={gridItem}
                      >{getSuggestionQuestion(1) === '' || getSuggestionQuestion(1) === undefined ? 'Please Add a Question' : getSuggestionQuestion(1)}
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        onClick={handleSendQuestion}
                        style={gridItem}
                      >{getSuggestionQuestion(2) === '' || getSuggestionQuestion(2) === undefined ? 'Please Add a Question' : getSuggestionQuestion(2)}
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        onClick={handleSendQuestion}
                        style={gridItem}
                      >{getSuggestionQuestion(3) === '' || getSuggestionQuestion(3) === undefined ? 'Please Add a Question' : getSuggestionQuestion(3)}
                      </Button>
                    </Box>
                  </Box>

                </Typography>
              </>

              :
              <>
                <Typography style={{
                  textAlign: 'center',
                  color: '#F0EAD6',
                  marginBottom: '3rem',
                  marginTop: '2rem',
                  fontFamily: '"Bebas Neue", sans-serif',
                  letterSpacing: '0.225rem',
                  fontSize: '4rem',
                }} variant="h3">KREST Chat</Typography>
                <Box
                  ref={chatContainerRef}
                  sx={{
                    height: '32rem',
                    // [theme.breakpoints.up('sm')]: {
                    //   height: '32rem',
                    // },
                    // [theme.breakpoints.up('md')]: {
                    //   height: '32rem',
                    // },
                    // [theme.breakpoints.up('lg')]: {
                    //   height: '32rem',
                    // },
                    // [theme.breakpoints.up('xl')]: {
                    //   height: '32rem',
                    // },
                    // [theme.breakpoints.down('xs')]: {
                    //   height: '32rem',
                    // },
                    overflowY: 'auto',
                    marginBottom: '1rem',
                    padding: '2rem',
                  }}
                >

                  {chatMessages.map((message) => (
                    <Box
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.isUser ? 'flex-start' : 'flex-start',
                        marginBottom: '1rem',
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          padding: '1rem',
                          borderRadius: '16px',
                          backgroundColor: message.isUser ? 'rgb(105 123 124)' : 'rgb(111 117 130)',
                          marginBottom: message.isUser ? '0px' : '1rem',
                          color: '#F0EAD6',
                          fontSize: '1.25rem',
                        }}
                      >
                        {message.message}
                      </Typography>
                    </Box>
                  ))}
                </Box>

              </>
            }

            <Box style={{
              marginTop: '3rem',
              position: 'relative',
              top: '-5vh',
            }}>

              <TextField
                fullWidth
                variant="outlined"
                label="Your Question"
                InputLabelProps={{
                  style: {
                    color: '#F0EAD6',
                  },
                }}
                inputProps={{
                  style: {
                    color: '#F0EAD6',
                  },
                }}
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleSendQuestion();
                  }
                }}
                style={{ marginTop: '2rem', color: '#F0EAD6', border: '2px solid darkgrey', width: '48rem', marginLeft: '1rem', borderRadius: '5px' }}
              />
              {/* <MicIcon variant='contained' style={{
                    position: 'relative',
                    top: '-5vh',
                    left: '46vw',
                    // padding: '8px',
                    height: '4.5vh',
                    width: '2vw',
                    backgroundColor: 'transparent',
                  }} onClick={handleSpeechRecognition} /> */}
            </Box>
            <Button
              variant="contained"
              onClick={handleSendQuestion}
              disabled={!userInput}
              style={{
                position: 'relative',
                top: '-6vh',
                left: '-0.5rem',
                margin: '1.6rem',
                marginLeft: '2rem',
                color: '#F0EAD6',
                backgroundColor: userInput ? 'rgb(128 149 151)' : 'rgb(30 36 36)',
              }}
            >
              Send
            </Button>
            <div className="box" style={{
              width: '5rem',
              height: '5rem',
              position: 'relative',
              top: '-10rem',
              left: '46.5rem',
              borderRadius: '5px',
            }}>
              <div id="redDot"></div>
            </div>






          </Paper>
        </Box>

        <Button
          variant='contained'
          style={toggleButtonStyle}
          onClick={handleShow}
        // onClick={() => setModalOpen(true)}
        >
          <span style={{
            fontSize: '1.5rem',
            position: 'relative',
            // top: '-0.5vh',
          }}>
            Add New Question
          </span>
        </Button>
        <Button
          variant='contained'
          style={toggleButtonStyle2}
          onClick={goToEditImage}
        // onClick={() => setModalOpen(true)}
        >
          <span style={{
            fontSize: '1.5rem',
            position: 'relative',
            // top: '-0.5vh',
          }}>
            Edit Image Data
          </span>
        </Button>
        {/* <CustomModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setModalOpen(false)}
                        onAddModule={handleAddModule}
                    /> */}
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100000, letterSpacing: '0.1rem' }}>
          <Modal.Dialog style={{ width: '80%', background: 'none', height: '80%' }}>
            <Modal.Header closeButton onHide={handleClose} >
              <h1>Add New Question</h1>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <Form.Group controlId="question">
                  <h2>Question:</h2>
                  <Form.Control
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    style={
                      {
                        width: '75%',
                        height: '3.5rem',
                        fontSize: '1.5rem',
                      }
                    }
                  />
                </Form.Group>
                <Form.Group controlId="answer">
                  <h2>Answer:</h2>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    style={{ width: '75%', fontSize: '1rem' }} // Set the width here
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>

            <Modal.Footer style={{
              margin: '2rem 0rem',
            }}>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={addQNA}>
                Add
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
