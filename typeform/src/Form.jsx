import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { useSpring, animated, useTrail } from 'react-spring';
import './Form.css';
import TopLeftLogo from './Top_left_logo.svg';
import WorldMap from './worldmap.svg';  // Make sure this import is correct

const questions = [
  {
    section: "Opportunities\nof AI",
    questions: [
      {
        question: "How can AI best support AFS's mission?",
        type: "multiple",
        options: ["Facilitate cross-language communication", "Personalize global learning", "Create new online connections", "Reach underserved communities"]
      },
      {
        question: "How can AI help AFS engage diverse communities?",
        type: "multiple",
        options: ["Increase access to global education", "Remove language and time barriers", "Enable real-time global connections", "Expand to hard-to-reach areas"]
      },
      {
        question: "What role should AI play in AFS's social impact?",
        type: "multiple",
        options: ["Enhance existing programs", "Launch diversity initiatives", "Foster intercultural understanding", "Empower self-directed learning"]
      }
    ]
  },
  {
    section: "Responsibilities\nof AI",
    questions: [
      {
        question: "Which AI ethics area should AFS prioritize?",
        type: "multiple",
        options: ["Fairness and inclusion", "Transparency", "Human oversight", "Balancing innovation and ethics"]
      },
      {
        question: "How crucial is aligning AI with AFS values?",
        type: "multiple",
        options: ["Always essential", "Important, but flexible", "Not always necessary", "Balance ethics and innovation"]
      },
      {
        question: "How should AFS handle AI data governance?",
        type: "multiple",
        options: ["Be transparent about data use", "Prioritize privacy", "Follow global AI standards", "Update policies for ethical compliance"]
      }
    ]
  },
  {
    section: "AI in\nAction",
    questions: [
      {
        question: "What's the best AI strategy for AFS?",
        type: "multiple",
        options: ["Launch global citizenship AI projects", "Improve internal processes", "Partner with AI innovators", "Expand global reach"]
      },
      {
        question: "How can AFS pilot impactful AI projects?",
        type: "multiple",
        options: ["Start small, high-impact initiatives", "Collaborate on AI testing", "Use AI to grow programs", "Focus on scalable solutions"]
      },
      {
        question: "How can AI support AFS's internal growth?",
        type: "multiple",
        options: ["Automate tasks for staff focus", "Improve data-driven decisions", "Enhance global communication", "Streamline operations"]
      },
      {
        question: "How important is AI to AFS's future?",
        type: "multiple",
        options: ["Essential (100%)", "Very important (75%)", "Somewhat important (50%)", "Not very important (25%)"]
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
    const totalQuestions = questions.reduce((total, section) => total + section.questions.length, 0);
    const answeredQuestions = Object.keys(answers).length;
    setAllQuestionsAnswered(answeredQuestions === totalQuestions);
  }, [answers]);

  useEffect(() => {
    // Generate random points once when the component mounts
    setProgressPoints(generateRandomPoints(totalQuestions));
  }, []);

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
      }, 500); // Changed from 1000 to 500 milliseconds
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
    // Immediately show the thank you page and confetti
    setShowConfetti(true);
    setIsSubmitted(true);

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

    // Send data to the webhook after showing the thank you page
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
      // You might want to show an error message to the user here
    });
  };

  const renderAudioOptions = () => {
    return (
      <div className="audio-options">
        <h2>Customize Your Audio Response</h2>
        <p>Based on your answers, we will craft an audio response addressing your concerns and questions.</p>
        
        <div className="option-group">
          <h3>Select audio duration:</h3>
          <div className="dropdown">
            <button 
              className="dropdown-toggle"
              onClick={() => setShowDurationDropdown(!showDurationDropdown)}
            >
              {audioDuration ? `${audioDuration}` : 'Select duration'}
              <ChevronDown size={20} />
            </button>
            {showDurationDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => { setAudioDuration('30 seconds - AI Espresso Shot'); setShowDurationDropdown(false); }}>
                  30 seconds - AI Espresso Shot
                </button>
                <button onClick={() => { setAudioDuration('2 minutes - AI Deep Dive'); setShowDurationDropdown(false); }}>
                  2 minutes - AI Deep Dive
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="option-group">
          <h3>Select audio language:</h3>
          <div className="dropdown">
            <button 
              className="dropdown-toggle"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              {audioLanguage || 'Select language'}
              <ChevronDown size={20} />
            </button>
            {showLanguageDropdown && (
              <div className="dropdown-menu">
                {['English', 'Spanish', 'French', 'Russian', 'Turkish', 'Arabic', 'Hindi', 'Mandarin'].map((language) => (
                  <button 
                    key={language}
                    onClick={() => { setAudioLanguage(language); setShowLanguageDropdown(false); }}
                  >
                    {language}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          className="return-button"
          onClick={() => {
            setShowAudioOptions(false);
            setCurrentSection(questions.length - 1);
            setCurrentQuestion(questions[questions.length - 1].questions.length - 1);
          }}
        >
          Return to Questions
        </button>

        <button 
          className="submit-button"
          onClick={submitAudioPreferences}
          disabled={!audioDuration || !audioLanguage}
        >
          Generate {audioDuration ? audioDuration.split(' - ')[0] : ''} Audio
        </button>
      </div>
    );
  };

  const renderProgressAnimation = () => (
    <div className="progress-container">
      <img src={WorldMap} alt="World Map" className="world-map-background" />
      <svg className="progress-svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
        {completedLines.map((lineIndex) => {
          const startPoint = progressPoints[lineIndex - 1];
          const endPoint = progressPoints[lineIndex];
          return (
            <line
              key={lineIndex}
              x1={`${startPoint.x}%`}
              y1={`${startPoint.y}%`}
              x2={`${endPoint.x}%`}
              y2={`${endPoint.y}%`}
              stroke="#ffffff"
              strokeWidth="2"
              className="progress-line"
            />
          );
        })}
      </svg>
      {progressPoints.map((point, index) => (
        <div
          key={index}
          className={`progress-point ${index < currentQuestionNumber ? 'active' : ''}`}
          style={{ 
            left: `${point.x}%`, 
            top: `${point.y}%`,
            opacity: index < currentQuestionNumber ? 1 : 0
          }}
        />
      ))}
    </div>
  );

  const generateRandomPoints = (count) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push({
        x: (i / (count - 1)) * 100,
        y: 30 + Math.random() * 40 // Random y position between 30% and 70%
      });
    }
    return points;
  };

  const renderContent = () => {
    if (isSubmitted) {
      return (
        <div className="thank-you-message">
          <h2>Thank you, {name}!</h2>
          <p>Your questionnaire has been successfully submitted.</p>
          <p>We appreciate your time and valuable input.</p>
          <p>An audio response addressing your concerns and questions will be crafted based on your preferences:</p>
          <ul>
            <li>Duration: {audioDuration}</li>
            <li>Language: {audioLanguage}</li>
          </ul>
          <p>We'll send it to your email: {email}</p>
        </div>
      );
    }

    if (showAudioOptions) {
      return renderAudioOptions();
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
                className={`option-button ${savedAnswer === option ? 'selected' : ''} ${selectedAnswer === option ? 'animate' : ''}`}
              >
                {option}
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
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
      <img src={TopLeftLogo} alt="AFS Logo" className="top-left-logo" />
      {!isSubmitted && !showAudioOptions && (
        <>
          <div className="section-progress">
            {questions.map((section, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSection(index);
                  setCurrentQuestion(0);
                  setShowSectionTitle(true);
                }}
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
          {renderProgressAnimation()}
        </>
      )}
      <div className="form-content">
        {renderContent()}
      </div>
      {!isSubmitted && !showAudioOptions && !showSectionTitle && (
        <div className="navigation-buttons">
          <button
            onClick={prevQuestion}
            disabled={currentSection === 0 && currentQuestion === 0}
            className="nav-button prev"
          >
            <ChevronLeft size={24} />
          </button>
          {currentSection === questions.length - 1 && currentQuestion === questions[currentSection].questions.length - 1 ? (
            <button
              onClick={submitSurvey}
              className="submit-button"
              disabled={!allQuestionsAnswered}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="nav-button next"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </animated.div>
  );
};

export default Form;