// Create floating particles
function createParticles() {
    const container = document.querySelector('.hero');
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = Math.random() * 0.6 + 0.1;
      particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(particle);
    }
  }
  
  // Hide header on scroll down
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('header');
    
    if (currentScroll <= 0) {
      header.classList.remove('header-hidden');
      return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('header-hidden')) {
      header.classList.add('header-hidden');
    } else if (currentScroll < lastScroll && header.classList.contains('header-hidden')) {
      header.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
  });
  
  // Animate elements when they come into view
  function animateOnScroll() {
    const elements = document.querySelectorAll('section, .result-box, .result-list li');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.style.animation = 'fadeInUp 0.8s ease-out forwards';
      }
    });
  }
  
  // Enhanced upload function with animation
  async function uploadFile() {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];
    const uploadBtn = document.querySelector('#upload button');
    
    if (!file) {
      showAlert("⚠️ Please select a file first.", 'warning');
      return;
    }
  
    // Add loading animation
    uploadBtn.innerHTML = '<span class="loader"></span> Uploading...';
    uploadBtn.disabled = true;
  
    try {
      let formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      
      // Success animation
      uploadBtn.innerHTML = '✓ Uploaded!';
      setTimeout(() => {
        uploadBtn.innerHTML = 'Upload PDF';
        uploadBtn.disabled = false;
      }, 1500);
      
      showAlert("✅ File uploaded successfully!", 'success');
      console.log(data);
      
      // Pulse animation on the next section
      document.getElementById('summarize').style.animation = 'pulse 1.5s ease';
      setTimeout(() => {
        document.getElementById('summarize').style.animation = '';
      }, 1500);
      
    } catch (error) {
      console.error('Error:', error);
      uploadBtn.innerHTML = 'Upload PDF';
      uploadBtn.disabled = false;
      showAlert("❌ Error uploading file.", 'error');
    }
  }
  
  // Enhanced summary function
  async function getSummary() {
    const summaryBtn = document.querySelector('#summarize button');
    const summaryBox = document.getElementById('summary-text');
    
    // Add loading animation
    summaryBtn.innerHTML = '<span class="loader"></span> Summarizing...';
    summaryBtn.disabled = true;
    summaryBox.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
  
    try {
      const response = await fetch('http://127.0.0.1:8000/summarize/');
      const data = await response.json();
      
      // Typewriter effect
      typewriterEffect(data.summary || "No summary available!", summaryBox);
      
      // Success state
      summaryBtn.innerHTML = 'Summarized!';
      setTimeout(() => {
        summaryBtn.innerHTML = 'Summarize';
        summaryBtn.disabled = false;
      }, 1500);
      
    } catch (error) {
      console.error('Error:', error);
      summaryBox.innerText = "Error fetching summary.";
      summaryBtn.innerHTML = 'Try Again';
      summaryBtn.disabled = false;
      showAlert("❌ Error fetching summary.", 'error');
    }
  }
  
  // Enhanced quiz generation
  async function generateQuiz() {
    const quizBtn = document.querySelector('#quiz button');
    const quizContainer = document.getElementById('quiz-questions');
    
    // Add loading animation
    quizBtn.innerHTML = '<span class="loader"></span> Generating...';
    quizBtn.disabled = true;
    quizContainer.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
  
    try {
      const response = await fetch('http://127.0.0.1:8000/generate-quiz/');
      const data = await response.json();
      
      quizContainer.innerHTML = '';
      const questions = data.questions.split('\n').filter(q => q.trim() !== '');
      
      // Animate each question in
      questions.forEach((question, i) => {
        setTimeout(() => {
          const li = document.createElement('li');
          li.innerText = question;
          quizContainer.appendChild(li);
          
          // Trigger animation
          setTimeout(() => {
            li.style.animation = 'fadeInUp 0.5s ease-out forwards';
          }, 50);
        }, i * 200);
      });
      
      // Success state
      quizBtn.innerHTML = 'Generated!';
      setTimeout(() => {
        quizBtn.innerHTML = 'Generate Quiz';
        quizBtn.disabled = false;
      }, 1500);
      
    } catch (error) {
      console.error('Error:', error);
      quizContainer.innerHTML = '<li>Error generating quiz</li>';
      quizBtn.innerHTML = 'Try Again';
      quizBtn.disabled = false;
      showAlert("❌ Error generating quiz.", 'error');
    }
  }
  
  // Enhanced question asking
  async function askQuestion() {
    const questionInput = document.getElementById('question-input');
    const askBtn = document.querySelector('#ask button');
    const answerBox = document.getElementById('answer-text');
    const question = questionInput.value.trim();
  
    if (!question) {
      showAlert("⚠️ Please enter a question.", 'warning');
      questionInput.style.animation = 'shake 0.5s';
      setTimeout(() => {
        questionInput.style.animation = '';
      }, 500);
      return;
    }
  
    // Add loading animation
    askBtn.innerHTML = '<span class="loader"></span> Thinking...';
    askBtn.disabled = true;
    answerBox.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
  
    try {
      const response = await fetch('http://127.0.0.1:8000/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
  
      const data = await response.json();
      
      // Typewriter effect for answer
      typewriterEffect(data.answer || "No answer found!", answerBox);
      
      // Success state
      askBtn.innerHTML = '✓ Answered!';
      setTimeout(() => {
        askBtn.innerHTML = 'Ask';
        askBtn.disabled = false;
      }, 1500);
      
    } catch (error) {
      console.error('Error:', error);
      answerBox.innerText = "Error getting answer.";
      askBtn.innerHTML = 'Try Again';
      askBtn.disabled = false;
      showAlert("❌ Error getting answer.", 'error');
    }
  }
  
  // Helper function for typewriter effect
  function typewriterEffect(text, element, speed = 20) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }
  
  // Custom alert notification
  function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
      alert.style.animation = 'fadeOut 0.5s ease-out forwards';
      setTimeout(() => alert.remove(), 500);
    }, 3000);
  }
  
  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Add shake animation for empty inputs
    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      });
    });
  });
  