import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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
  };

  const nextQuestion = () => {
    if (currentQuestion < questions[currentSection].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < questions.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(-1); // Set to -1 to show the title page of the next section
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

  const submitSurvey = async () => {
    const surveyData = {
      name,
      email,
      responses: questions.flatMap((section, sectionIndex) =>
        section.questions.map((question, questionIndex) => ({
          question: question.question,
          answer: answers[`${sectionIndex}-${questionIndex}`] || ''
        }))
      )
    };

    try {
      const response = await fetch('https://hook.eu2.make.com/scyn2yen4r28tc8lzbbcqlsdca1us3y5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        localStorage.removeItem('surveyState'); // Clear local storage after successful submission
      } else {
        console.error('Failed to submit survey');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      // You might want to show an error message to the user here
    }
  };

  const renderContent = () => {
    if (isSubmitted) {
      return (
        <div className="thank-you-message">
          <h2>Thank you for completing the survey!</h2>
          <p>Your responses have been submitted successfully.</p>
        </div>
      );
    }

    if (currentQuestion === -1) {
      // Section title page
      return (
        <div className="section-title" onClick={() => setCurrentQuestion(0)}>
          <h2>{questions[currentSection].section}</h2>
          <p className="tap-to-continue">Tap to continue</p>
        </div>
      );
    }

    const currentQuestionData = questions[currentSection].questions[currentQuestion];
    const savedAnswer = answers[`${currentSection}-${currentQuestion}`];
    const questionNumber = currentSection * 4 + currentQuestion + 1; // Calculate question number

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
                onClick={() => {
                  handleAnswer(option);
                  nextQuestion();
                }}
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
            onChange={(e) => handleAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && nextQuestion()}
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
          <h2 className="question-text">Please enter your information to begin the survey</h2>
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
              Start Survey
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <img src={TopLeftLogo} alt="AFS Logo" className="top-left-logo" />
      <div className="section-progress">
        {questions.map((section, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSection(index);
              setCurrentQuestion(-1); // Set to -1 to show the title page when clicking on a section
            }}
            className={`section-progress-item ${currentSection === index ? 'active' : ''}`}
          >
            {section.section}
          </button>
        ))}
      </div>
      <div className="form-content">
        {renderContent()}
      </div>
      {currentQuestion !== -1 && !isSubmitted && (
        <div className="navigation-buttons">
          <button
            onClick={prevQuestion}
            disabled={currentSection === 0 && currentQuestion === 0}
            className="nav-button prev"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => {
              if (currentSection === questions.length - 1 && currentQuestion === questions[currentSection].questions.length - 1) {
                submitSurvey();
              } else {
                nextQuestion();
              }
            }}
            className="nav-button next"
          >
            {currentSection === questions.length - 1 && currentQuestion === questions[currentSection].questions.length - 1 ? 'Submit' : <ChevronRight size={24} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;