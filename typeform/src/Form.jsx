import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Music, Headphones, Sparkles } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { useSpring, animated, useTrail } from 'react-spring';
import './Form.css';
import TopLeftLogo from './Top_left_logo.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const questions = [
  {
    section: "AI Adoption\nand Preparation",
    questions: [
      {
        question: "How well prepared is AFS for AI adoption?",
        type: "multiple",
        options: [
          "Fully prepared – AFS has a solid foundation to integrate AI.",
          "Moderately prepared – Some steps have been taken, but more is needed.",
          "Somewhat prepared – AFS is starting, but there are significant gaps.",
          "Not prepared – AFS needs to begin preparing for AI adoption."
        ]
      },
      {
        question: "What does AFS need to work hardest on to be able to adopt AI?",
        type: "multiple",
        options: [
          "Building the technical infrastructure for AI.",
          "Training staff and volunteers on AI usage.",
          "Aligning AI with AFS's values and mission.",
          "Securing funding and partnerships for AI development."
        ]
      },
      {
        question: "In which area do you think AI can support AFS best?",
        type: "multiple",
        options: [
          "Enhancing global education programs.",
          "Improving intercultural communication and exchange.",
          "Streamlining internal operations and efficiency.",
          "Expanding AFS's global outreach and impact."
        ]
      }
    ]
  },
  {
    section: "AI and AFS\nMission",
    questions: [
      {
        question: "Can AI support AFS's mission in Creating Global Citizens?",
        type: "multiple",
        options: [
          "Yes, AI can play a key role in developing global citizens.",
          "Yes, but only if AI is used carefully and ethically.",
          "AI might help, but it's not essential to this mission.",
          "No, AI does not align with the mission of creating global citizens."
        ]
      },
      {
        question: "What is your greatest concern in incorporating AI to AFS today?",
        type: "multiple",
        options: [
          "Potential ethical issues or biases in AI systems.",
          "Lack of resources or funding to implement AI effectively.",
          "AI replacing the human-centered aspects of AFS programs.",
          "Data privacy and security challenges."
        ]
      },
      {
        question: "What is AFS's greatest challenge in integrating AI?",
        type: "multiple",
        options: [
          "Keeping AI aligned with AFS's values of inclusion and diversity.",
          "Ensuring the right technology and tools are in place.",
          "Convincing stakeholders and gaining buy-in for AI initiatives.",
          "Balancing innovation with ethical and legal considerations."
        ]
      }
    ]
  },
  {
    section: "Future of AI\nin AFS",
    questions: [
      {
        question: "To what extent do you agree with AFS incorporating AI as a permanent tool?",
        type: "multiple",
        options: [
          "Strongly agree – AI should be a key part of AFS's future.",
          "Agree – AI should be used, but with limitations.",
          "Neutral – AI could be helpful but isn't a priority.",
          "Disagree – AI shouldn't play a big role at AFS."
        ]
      },
      {
        question: "Do you have any recommendations for AFS as it moves forward with AI?",
        type: "multiple",
        options: [
          "Yes, focus on using AI to enhance education and learning.",
          "Yes, prioritize ethical considerations and human oversight.",
          "Yes, invest in training and development for staff.",
          "No, AFS should be cautious and move slowly with AI integration."
        ]
      },
      {
        question: "What kind of AI projects should AFS prioritize first?",
        type: "multiple",
        options: [
          "Educational tools (e.g., personalized learning).",
          "Cultural exchange support (e.g., language translation).",
          "Operational efficiency (e.g., automating administrative tasks).",
          "Expanding global impact through outreach."
        ]
      },
      {
        question: "What's the most exciting opportunity AI could bring to AFS?",
        type: "multiple",
        options: [
          "Reaching more diverse communities.",
          "Improving the quality of global education programs.",
          "Making intercultural exchange easier and faster.",
          "Creating more personalized, engaging experiences for learners."
        ]
      }
    ]
  }
];

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSurvey, setShowSurvey] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAudioOptions, setShowAudioOptions] = useState(false);
  const [audioDuration, setAudioDuration] = useState('');
  const [audioLanguage, setAudioLanguage] = useState('');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [showSectionTitle, setShowSectionTitle] = useState(true);
  const [direction, setDirection] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [progressPoints, setProgressPoints] = useState([]);
  const [completedLines, setCompletedLines] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);
  const [generationTimer, setGenerationTimer] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const totalQuestions = questions.reduce((total, section) => total + section.questions.length, 0);
  const currentQuestionNumber = questions.slice(0, currentSection).reduce((total, section) => total + section.questions.length, 0) + currentQuestion + 1;

  const progressTrail = useTrail(totalQuestions, {
    width: `${(100 / totalQuestions) * currentQuestionNumber}%`,
    from: { width: '0%' },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const slideAnimation = useSpring({
    opacity: 1,
    transform: `translateX(${direction * 0}%)`,
    from: { opacity: 0, transform: `translateX(${direction * 100}%)` },
    config: { mass: 1, tension: 80, friction: 26 }
  });

  const parallaxAnimation = useSpring({
    from: { backgroundPositionY: '0%' },
    to: async (next) => {
      while (true) {
        await next({ backgroundPositionY: '100%' });
        await next({ backgroundPositionY: '0%' });
      }
    },
    config: { duration: 20000 },
  });

  useEffect(() => {
    const savedState = localStorage.getItem('surveyState');
    if (savedState) {
      const { name, email, answers, currentSection, currentQuestion, showSurvey } = JSON.parse(savedState);
      setName(name);
      setEmail(email);
      setAnswers(answers);
      setCurrentSection(currentSection);
      setCurrentQuestion(currentQuestion);
      setShowSurvey(showSurvey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('surveyState', JSON.stringify({ name, email, answers, currentSection, currentQuestion, showSurvey }));
  }, [name, email, answers, currentSection, currentQuestion, showSurvey]);

  useEffect(() => {
    const unanswered = [];
    questions.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        const questionNumber = questions.slice(0, sectionIndex).reduce((total, s) => total + s.questions.length, 0) + questionIndex + 1;
        if (!answers[`${sectionIndex}-${questionIndex}`]) {
          unanswered.push(questionNumber);
        }
      });
    });
    setUnansweredQuestions(unanswered);
    setAllQuestionsAnswered(unanswered.length === 0);
  }, [answers]);

  useEffect(() => {
    if (currentQuestionNumber > 1) {
      setCompletedLines(prev => [...prev, currentQuestionNumber - 1]);
    }
  }, [currentQuestionNumber]);

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      setShowSurvey(true);
      setCurrentSection(0);
      setCurrentQuestion(0);
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setAnswers({
      ...answers,
      [`${currentSection}-${currentQuestion}`]: answer
    });
    
    const isLastQuestion = currentSection === questions.length - 1 && currentQuestion === questions[currentSection].questions.length - 1;
    
    if (questions[currentSection].questions[currentQuestion].type === 'multiple' && !isLastQuestion) {
      setTimeout(() => {
        nextQuestion();
      }, 500);
    }
  };

  const handleTextInputChange = (e) => {
    handleAnswer(e.target.value);
  };

  const handleTextInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    setDirection(1);
    if (currentQuestion < questions[currentSection].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < questions.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      setShowSectionTitle(true);
    } else {
      submitSurvey();
    }
  };

  const prevQuestion = () => {
    setDirection(-1);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(questions[currentSection - 1].questions.length - 1);
    }
  };

  const submitSurvey = () => {
    setShowAudioOptions(true);
  };

  const submitAudioPreferences = () => {
    setShowConfetti(true);
    setIsSubmitted(true);

    // Set the countdown based on the selected audio duration
    if (audioDuration.includes('2 minutes')) {
      setCountdown(60); // 60 seconds for 2-minute audio
    } else if (audioDuration.includes('30 seconds')) {
      setCountdown(15); // 15 seconds for 30-second audio
    }

    const surveyData = {
      name,
      email,
      responses: questions.flatMap((section, sectionIndex) =>
        section.questions.map((question, questionIndex) => ({
          question: question.question,
          answer: answers[`${sectionIndex}-${questionIndex}`] || ''
        }))
      ),
      audioPreferences: {
        duration: audioDuration.split(' - ')[0], // Extract just the duration part
        language: audioLanguage
      }
    };

    const webhookUrl = 'https://ai-podcast-603006204318.europe-west2.run.app/webhook';

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      localStorage.removeItem('surveyState');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const renderAudioOptions = () => {
    return (
      <div className="audio-options">
        <h2>Customize Your Audio Response</h2>
        <div className="option-group">
          <h3>Select audio duration:</h3>
          <div className="audio-option-buttons">
            <button onClick={() => setAudioDuration('30 seconds - AI Espresso Shot')} className={`audio-option ${audioDuration === '30 seconds - AI Espresso Shot' ? 'selected' : ''}`}>
              30 seconds - AI Espresso Shot
            </button>
            <button onClick={() => setAudioDuration('2 minutes - AI Deep Dive')} className={`audio-option ${audioDuration === '2 minutes - AI Deep Dive' ? 'selected' : ''}`}>
              2 minutes - AI Deep Dive
            </button>
          </div>
        </div>

        <div className="option-group">
          <h3>Select audio language:</h3>
          <div className="audio-option-buttons">
            {['English', 'Spanish', 'French', 'Russian', 'Turkish', 'Arabic', 'Hindi', 'Mandarin'].map((language) => (
              <button 
                key={language}
                onClick={() => setAudioLanguage(language)}
                className={`audio-option ${audioLanguage === language ? 'selected' : ''}`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="submit-button"
          onClick={submitAudioPreferences}
          disabled={!audioDuration || !audioLanguage}
        >
          Generate {audioDuration ? audioDuration.split(' - ')[0] : ''} Audio
        </button>

        <button 
          className="back-button"
          onClick={() => setShowAudioOptions(false)}
        >
          Back to Questions
        </button>
      </div>
    );
  };

  const handleSubmitClick = () => {
    if (allQuestionsAnswered) {
      submitSurvey();
    } else {
      const unansweredMessage = `Please answer ${unansweredQuestions.length > 1 ? 'questions' : 'question'} ${unansweredQuestions.join(', ')} before submitting.`;
      toast.error(unansweredMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast',
        bodyClassName: 'custom-toast-body',
        progressClassName: 'custom-toast-progress',
      });
    }
  };

  const renderContent = () => {
    if (showThankYou) {
      return (
        <div className="thank-you-message">
          <Sparkles className="thank-you-icon" size={64} />
          <h2>Thank you, {name}!</h2>
          <p>Your personalized AI insights are ready!</p>
          <div className="audio-details">
            <div className="audio-detail">
              <Music size={24} />
              <span>Duration: {audioDuration}</span>
            </div>
            <div className="audio-detail">
              <Headphones size={24} />
              <span>Language: {audioLanguage}</span>
            </div>
          </div>
          <p className="email-sent">We've sent your audio response to: <strong>{email}</strong></p>
          <p className="enjoy-message">Enjoy your AI-powered insights!</p>
        </div>
      );
    }

    if (isSubmitted && countdown !== null) {
      return (
        <div className="generation-animation">
          <h2>Crafting Your AI-Powered Insights!</h2>
          <p>Hang tight while we whip up some audio magic just for you!</p>
          <div className="countdown-timer">
            <svg width="200" height="200">
              <circle cx="100" cy="100" r="90" />
              <circle
                cx="100"
                cy="100"
                r="90"
                strokeDasharray="565.48"
                strokeDashoffset={`${565.48 - (565.48 * countdown) / (audioDuration.includes('2 minutes') ? 60 : 15)}`}
                className="progress"
              />
            </svg>
            <div className="timer-content">
              <div className="text">{countdown}</div>
            </div>
          </div>
          <div className="fun-facts">
            <p>Did you know? An AI can analyze years of data in seconds!</p>
          </div>
        </div>
      );
    }

    if (showAudioOptions) {
      return (
        <div className="audio-options">
          <h2>Customize Your Audio Response</h2>
          <div className="option-group">
            <h3>Select audio duration:</h3>
            <div className="audio-option-buttons">
              <button onClick={() => setAudioDuration('30 seconds - AI Espresso Shot')} className={`audio-option ${audioDuration === '30 seconds - AI Espresso Shot' ? 'selected' : ''}`}>
                30 seconds - AI Espresso Shot
              </button>
              <button onClick={() => setAudioDuration('2 minutes - AI Deep Dive')} className={`audio-option ${audioDuration === '2 minutes - AI Deep Dive' ? 'selected' : ''}`}>
                2 minutes - AI Deep Dive
              </button>
            </div>
          </div>

          <div className="option-group">
            <h3>Select audio language:</h3>
            <div className="audio-option-buttons">
              {['English', 'Spanish', 'French', 'Russian', 'Turkish', 'Arabic', 'Hindi', 'Mandarin'].map((language) => (
                <button 
                  key={language}
                  onClick={() => setAudioLanguage(language)}
                  className={`audio-option ${audioLanguage === language ? 'selected' : ''}`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="submit-button"
            onClick={submitAudioPreferences}
            disabled={!audioDuration || !audioLanguage}
          >
            Generate {audioDuration ? audioDuration.split(' - ')[0] : ''} Audio
          </button>
        </div>
      );
    }

    if (showSectionTitle) {
      return (
        <div className="section-title" onClick={() => setShowSectionTitle(false)}>
          <h2>{questions[currentSection].section}</h2>
          <p className="tap-to-continue">Tap to continue</p>
        </div>
      );
    }

    const currentQuestionData = questions[currentSection].questions[currentQuestion];
    const savedAnswer = answers[`${currentSection}-${currentQuestion}`];
    const questionNumber = currentSection * 3 + currentQuestion + 1;

    return (
      <animated.div style={slideAnimation}>
        <h3 className="question-text">
          <span className="question-number">{questionNumber}. </span>
          {currentQuestionData.question}
        </h3>
        {currentQuestionData.type === 'multiple' ? (
          <div className="options-container">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`option-button ${savedAnswer === option ? 'selected' : ''}`}
              >
                {questionNumber === 9 ? (
                  option === "Expanding global impact through outreach." ? (
                    option
                  ) : (
                    <>
                      {option.split('(')[0]}
                      <span className="option-description">({option.split('(')[1]}</span>
                    </>
                  )
                ) : questionNumber === 10 ? (
                  option
                ) : option.includes(' – ') ? (
                  <>
                    <strong>{option.split(' – ')[0]}</strong>
                    {' – '}
                    <span className="option-description">{option.split(' – ')[1]}</span>
                  </>
                ) : option.includes(',') ? (
                  <>
                    <strong>{option.split(',')[0]}</strong>
                    <span className="option-description">{', ' + option.split(',').slice(1).join(',')}</span>
                  </>
                ) : (
                  option
                )}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={savedAnswer || ''}
            onChange={handleTextInputChange}
            onKeyPress={handleTextInputKeyPress}
            className="text-input"
            placeholder="Type your answer..."
          />
        )}
      </animated.div>
    );
  };

  const handleSectionClick = (index) => {
    setCurrentSection(index);
    setCurrentQuestion(0);
    setShowSectionTitle(true);
  };

  const handleContinue = () => {
    setShowSectionTitle(false);
  };

  useEffect(() => {
    let interval;
    if (isSubmitted && audioDuration.includes('2 minutes') && generationTimer < 60) {
      interval = setInterval(() => {
        setGenerationTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSubmitted, audioDuration, generationTimer]);

  useEffect(() => {
    let interval;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowThankYou(true);
      setShowConfetti(true);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  if (!showSurvey) {
    return (
      <div className="email-container">
        <img src={TopLeftLogo} alt="AFS Logo" className="top-left-logo" />
        <div className="email-content">
          <h2 className="question-text">Please enter your information to begin the questionnaire</h2>
          <form onSubmit={handleUserInfoSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="email-input"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="email-input"
              required
            />
            <button type="submit" className="email-submit-button" style={{ color: '#ffffff' }}>
              Start Questionnaire
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <animated.div className="form-container" style={parallaxAnimation}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
      <img src={TopLeftLogo} alt="AFS Logo" className="top-left-logo" />
      {!isSubmitted && !showAudioOptions && (
        <>
          <div className="section-progress">
            {questions.map((section, index) => (
              <button
                key={index}
                onClick={() => handleSectionClick(index)}
                className={`section-progress-item ${currentSection === index ? 'active' : ''}`}
              >
                {section.section.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== section.section.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </button>
            ))}
          </div>
          {/* Comment out the progress animation */}
          {/*renderProgressAnimation()*/}
        </>
      )}
      <div className="form-content">
        {showSectionTitle ? (
          <div className="section-title" onClick={handleContinue}>
            <h2>{questions[currentSection].section}</h2>
            <p className="tap-to-continue">Tap anywhere to continue</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
      {!isSubmitted && !showAudioOptions && !showSectionTitle && (
        <>
          {currentSection === questions.length - 1 && currentQuestion === questions[currentSection].questions.length - 1 && (
            <div className="submit-container">
              <button
                onClick={handleSubmitClick}
                className={`submit-button ${allQuestionsAnswered ? 'ready' : 'disabled'}`}
              >
                Submit
              </button>
            </div>
          )}
          <div className="navigation-buttons">
            <button
              onClick={prevQuestion}
              disabled={currentSection === 0 && currentQuestion === 0}
              className="nav-button prev"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextQuestion}
              className="nav-button next"
              style={{visibility: currentSection === questions.length - 1 && currentQuestion === questions[currentSection].questions.length - 1 ? 'hidden' : 'visible'}}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}
    </animated.div>
  );
};

export default Form;