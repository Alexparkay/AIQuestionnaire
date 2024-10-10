import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import './Form.css';
import TopLeftLogo from './Top_left_logo.svg';

const questions = [
  {
    section: "Opportunities of AI",
    questions: [
      {
        question: "Which AI application excites you the most?",
        type: "multiple",
        options: ["Automation", "Personalization", "Global collaboration", "Education"]
      },
      {
        question: "In one word, how would you describe the future of AI?",
        type: "text"
      },
      {
        question: "What's the biggest benefit of AI in your opinion?",
        type: "multiple",
        options: ["Efficiency", "Accessibility", "Innovation", "Problem-solving"]
      },
      {
        question: "What's your primary concern about AI?",
        type: "multiple",
        options: ["Job displacement", "Privacy issues", "Ethical concerns", "Over-reliance on technology"]
      }
    ]
  },
  {
    section: "Responsible AI",
    questions: [
      {
        question: "How important do you think AI transparency is?",
        type: "multiple",
        options: ["Very important", "Somewhat important", "Not very important", "Not sure"]
      },
      {
        question: "Who should be primarily responsible for AI governance?",
        type: "multiple",
        options: ["Governments", "Tech companies", "Independent bodies", "Collaborative effort"]
      },
      {
        question: "What's the most crucial aspect of AI ethics?",
        type: "multiple",
        options: ["Fairness", "Privacy", "Accountability", "Transparency"]
      },
      {
        question: "Do you believe current AI regulations are:",
        type: "multiple",
        options: ["Too strict", "Adequate", "Not strict enough", "I don't know enough to say"]
      }
    ]
  },
  {
    section: "AI in Action",
    questions: [
      {
        question: "How comfortable are you with using AI in your daily work/life?",
        type: "multiple",
        options: ["Very comfortable", "Somewhat comfortable", "Not very comfortable", "Not at all comfortable"]
      },
      {
        question: "What AI skill do you think is most important to develop?",
        type: "multiple",
        options: ["Data analysis", "AI ethics", "Programming", "Critical thinking"]
      },
      {
        question: "In one or two words, what's your biggest takeaway from this presentation?",
        type: "text"
      },
      {
        question: "After this presentation, how likely are you to learn more about AI?",
        type: "multiple",
        options: ["Very likely", "Somewhat likely", "Not very likely", "Not at all likely"]
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

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      setShowSurvey(true);
      setCurrentSection(0);
      setCurrentQuestion(0);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [`${currentSection}-${currentQuestion}`]: answer
    });
    const isLastQuestion = currentSection === questions.length - 1 && currentQuestion === questions[currentSection].questions.length - 1;
    if (questions[currentSection].questions[currentQuestion].type === 'multiple' && !isLastQuestion) {
      nextQuestion();
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
        duration: audioDuration,
        language: audioLanguage
      }
    };

    // Simulating a POST request to the webhook
    console.log('Sending data to webhook:', JSON.stringify(surveyData));
    // In a real scenario, you would use fetch or axios to send the data
    // fetch('http://your-webhook-url.com', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(surveyData)
    // })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    // .catch((error) => console.error('Error:', error));

    setShowConfetti(true);
    setIsSubmitted(true);
    localStorage.removeItem('surveyState');
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
              {audioDuration ? `Around ${audioDuration} minutes` : 'Select duration'}
              <ChevronDown size={20} />
            </button>
            {showDurationDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => { setAudioDuration('2'); setShowDurationDropdown(false); }}>Around 2 minutes</button>
                <button onClick={() => { setAudioDuration('5'); setShowDurationDropdown(false); }}>Around 5 minutes</button>
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
                {['English', 'Mandarin', 'Hindi', 'Spanish', 'French', 'Arabic', 'Bengali', 'Russian', 'Portuguese', 'Indonesian'].map((language) => (
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
          Submit Preferences
        </button>
      </div>
    );
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
            <li>Duration: Around {audioDuration} minutes</li>
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
    const questionNumber = currentSection * 4 + currentQuestion + 1;

    return (
      <>
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
      </>
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
            <button type="submit" className="email-submit-button">
              Start Questionnaire
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
      <img src={TopLeftLogo} alt="AFS Logo" className="top-left-logo" />
      {!isSubmitted && !showAudioOptions && (
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
              {section.section}
            </button>
          ))}
        </div>
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
    </div>
  );
};

export default Form;