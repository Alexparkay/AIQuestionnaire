import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import './Form.css';
import TopLeftLogo from './Top_left_logo.svg';

const questions = [
  {
    section: "Opportunities\nof AI",
    questions: [
      {
        question: "Which AI application do you find most promising for global citizenship?",
        type: "multiple",
        options: ["Language translation", "Cultural exchange platforms", "Educational tools", "Environmental monitoring"]
      },
      {
        question: "In one word, how would you describe AI's potential impact on global citizenship?",
        type: "text"
      },
      {
        question: "What's the biggest benefit of AI for fostering international understanding?",
        type: "multiple",
        options: ["Breaking language barriers", "Facilitating virtual exchanges", "Personalizing cultural learning", "Enhancing global collaboration"]
      },
      {
        question: "What's your primary concern about AI in the context of global citizenship?",
        type: "multiple",
        options: ["Cultural homogenization", "Privacy issues", "Unequal access to technology", "Over-reliance on virtual interactions"]
      }
    ]
  },
  {
    section: "Responsibilities\nof AI",
    questions: [
      {
        question: "How important do you think ethical considerations are in AI development for global initiatives?",
        type: "multiple",
        options: ["Very important", "Somewhat important", "Not very important", "Not sure"]
      },
      {
        question: "Who should take the lead in ensuring AI promotes responsible global citizenship?",
        type: "multiple",
        options: ["International organizations", "Tech companies", "Governments", "Educational institutions"]
      },
      {
        question: "What's the most crucial aspect of AI ethics in a global context?",
        type: "multiple",
        options: ["Cultural sensitivity", "Data privacy", "Fairness across diverse populations", "Transparency of AI decision-making"]
      },
      {
        question: "Do you believe current international AI guidelines are:",
        type: "multiple",
        options: ["Too strict", "Adequate", "Not comprehensive enough", "I don't know enough to say"]
      }
    ]
  },
  {
    section: "AI in\nAction",
    questions: [
      {
        question: "How do you envision AI enhancing AFS's intercultural learning programs?",
        type: "multiple",
        options: ["Improved participant matching", "Enhanced pre-departure training", "Real-time language support", "Personalized cultural adaptation tools"]
      },
      {
        question: "What AI-related skill do you think is most important for AFS to develop?",
        type: "multiple",
        options: ["Data analysis for program improvement", "AI ethics in cross-cultural contexts", "AI-enhanced intercultural training", "Automated language processing"]
      },
      {
        question: "In one or two words, what's your biggest hope for AI in AFS's future?",
        type: "text"
      },
      {
        question: "After this presentation, how likely are you to advocate for AI integration in AFS programs?",
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

    // Send data to the webhook after showing the thank you page
    fetch('http://127.0.0.1:5000/webhook', {
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
              {section.section.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== section.section.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
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