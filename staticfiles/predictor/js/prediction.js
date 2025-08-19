// Prediction Form JavaScript for DiabetesAI

document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('predictionForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const predictBtn = document.getElementById('predictBtn');
    
    if (!predictionForm) return;
    
    // Form submission handler
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        showLoadingState();
        
        // Collect form data
        const formData = new FormData(predictionForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key !== 'csrfmiddlewaretoken') {
                data[key] = value;
            }
        }
        
        // Validate data
        const validation = window.DiabetesAI.validateHealthData(data);
        if (!validation.isValid) {
            hideLoadingState();
            showValidationErrors(validation.errors);
            return;
        }
        
        try {
            // Make prediction request
            const response = await fetch('/api/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showPredictionResults(result);
            } else {
                throw new Error(result.error || 'Prediction failed');
            }
            
        } catch (error) {
            console.error('Prediction error:', error);
            hideLoadingState();
            showErrorMessage('Failed to get prediction. Please try again.');
        }
    });
    
    // Show loading state
    function showLoadingState() {
        const btnText = predictBtn.querySelector('span');
        const btnIcon = predictBtn.querySelector('i:not(.loading-spinner i)');
        const spinner = predictBtn.querySelector('.loading-spinner');
        
        predictBtn.disabled = true;
        btnText.textContent = 'Analyzing...';
        btnIcon.style.display = 'none';
        spinner.style.display = 'inline-block';
        predictBtn.classList.add('loading');
    }
    
    // Hide loading state
    function hideLoadingState() {
        const btnText = predictBtn.querySelector('span');
        const btnIcon = predictBtn.querySelector('i:not(.loading-spinner i)');
        const spinner = predictBtn.querySelector('.loading-spinner');
        
        predictBtn.disabled = false;
        btnText.textContent = 'Predict Diabetes Risk';
        btnIcon.style.display = 'inline-block';
        spinner.style.display = 'none';
        predictBtn.classList.remove('loading');
    }
    
    // Show prediction results
    function showPredictionResults(result) {
        hideLoadingState();
        
        // Update result elements
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const probabilityText = document.getElementById('probabilityText');
        const probabilityCircle = document.getElementById('probabilityCircle');
        const riskValue = document.getElementById('riskValue');
        const resultIcon = document.getElementById('resultIcon');
        
        // Calculate percentage
        const percentage = Math.round(result.probability * 100);
        
        // Update content
        resultTitle.textContent = result.prediction ? 'High Diabetes Risk' : 'Low Diabetes Risk';
        resultMessage.textContent = result.prediction 
            ? 'Based on your health data, you may be at risk for diabetes.'
            : 'Based on your health data, your diabetes risk appears to be low.';
        
        probabilityText.textContent = `${percentage}%`;
        
        // Update risk level
        let riskLevel, riskColor;
        if (percentage < 30) {
            riskLevel = 'Low Risk';
            riskColor = '#48bb78';
        } else if (percentage < 70) {
            riskLevel = 'Moderate Risk';
            riskColor = '#ed8936';
        } else {
            riskLevel = 'High Risk';
            riskColor = '#e53e3e';
        }
        
        riskValue.textContent = riskLevel;
        riskValue.style.color = riskColor;
        
        // Update probability circle
        const degrees = (percentage / 100) * 360;
        probabilityCircle.style.background = `conic-gradient(${riskColor} ${degrees}deg, #e2e8f0 ${degrees}deg)`;
        
        // Update icon based on result
        const iconElement = resultIcon.querySelector('i');
        if (result.prediction) {
            iconElement.className = 'fas fa-exclamation-triangle';
            resultIcon.style.background = 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
        } else {
            iconElement.className = 'fas fa-check-circle';
            resultIcon.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        }
        
        // Show results container with animation
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Animate probability circle
        animateProbabilityCircle(percentage, riskColor);
        
        // Show recommendations
        showRecommendations(result.prediction, percentage);
        
        // Show success notification
        if (window.DiabetesAI && window.DiabetesAI.showNotification) {
            window.DiabetesAI.showNotification('Prediction completed successfully!', 'success');
        }
    }
    
    // Animate probability circle
    function animateProbabilityCircle(targetPercentage, color) {
        const circle = document.getElementById('probabilityCircle');
        const text = document.getElementById('probabilityText');
        let currentPercentage = 0;
        const increment = targetPercentage / 50; // 50 frames for smooth animation
        
        const animate = () => {
            if (currentPercentage < targetPercentage) {
                currentPercentage += increment;
                const degrees = (currentPercentage / 100) * 360;
                circle.style.background = `conic-gradient(${color} ${degrees}deg, #e2e8f0 ${degrees}deg)`;
                text.textContent = `${Math.round(currentPercentage)}%`;
                requestAnimationFrame(animate);
            } else {
                const degrees = (targetPercentage / 100) * 360;
                circle.style.background = `conic-gradient(${color} ${degrees}deg, #e2e8f0 ${degrees}deg)`;
                text.textContent = `${targetPercentage}%`;
            }
        };
        
        animate();
    }
    
    // Show recommendations based on prediction
    function showRecommendations(isDiabetic, probability) {
        const recommendationsSection = document.getElementById('recommendations');
        const recommendationList = document.getElementById('recommendationList');
        
        let recommendations = [];
        
        if (isDiabetic || probability > 50) {
            recommendations = [
                {
                    icon: 'fas fa-user-md',
                    title: 'Consult a Healthcare Provider',
                    description: 'Schedule an appointment with your doctor for proper diabetes screening and diagnosis.'
                },
                {
                    icon: 'fas fa-heartbeat',
                    title: 'Monitor Blood Sugar',
                    description: 'Regular blood glucose monitoring can help track your health status.'
                },
                {
                    icon: 'fas fa-apple-alt',
                    title: 'Healthy Diet',
                    description: 'Follow a balanced diet low in processed sugars and high in fiber.'
                },
                {
                    icon: 'fas fa-running',
                    title: 'Regular Exercise',
                    description: 'Engage in at least 150 minutes of moderate exercise per week.'
                }
            ];
        } else {
            recommendations = [
                {
                    icon: 'fas fa-check-circle',
                    title: 'Maintain Healthy Lifestyle',
                    description: 'Continue your current healthy habits to maintain low diabetes risk.'
                },
                {
                    icon: 'fas fa-calendar-check',
                    title: 'Regular Check-ups',
                    description: 'Schedule annual health screenings to monitor your health status.'
                },
                {
                    icon: 'fas fa-apple-alt',
                    title: 'Balanced Nutrition',
                    description: 'Maintain a balanced diet rich in vegetables, fruits, and whole grains.'
                },
                {
                    icon: 'fas fa-dumbbell',
                    title: 'Stay Active',
                    description: 'Continue regular physical activity to maintain your health.'
                }
            ];
        }
        
        // Generate recommendation HTML
        recommendationList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <div class="recommendation-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            </div>
        `).join('');
        
        // Show recommendations section
        recommendationsSection.style.display = 'block';
        
        // Add CSS for recommendations if not already added
        if (!document.querySelector('#recommendation-styles')) {
            const style = document.createElement('style');
            style.id = 'recommendation-styles';
            style.textContent = `
                .recommendation-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 1rem;
                    transition: all 0.3s ease;
                }
                
                .recommendation-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                }
                
                .recommendation-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }
                
                .recommendation-content h4 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                }
                
                .recommendation-content p {
                    color: #718096;
                    line-height: 1.5;
                }
                
                .recommendations {
                    margin-top: 2rem;
                    padding: 2rem;
                    background: #f7fafc;
                    border-radius: 12px;
                }
                
                .recommendations h3 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 1.5rem;
                }
                
                .recommendations h3 i {
                    color: #667eea;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Show validation errors
    function showValidationErrors(errors) {
        const errorMessage = errors.join('\n');
        alert('Please correct the following errors:\n\n' + errorMessage);
    }
    
    // Show error message
    function showErrorMessage(message) {
        if (window.DiabetesAI && window.DiabetesAI.showNotification) {
            window.DiabetesAI.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
    
    // Get CSRF token
    function getCsrfToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    }
    
    // Reset prediction function (global)
    window.resetPrediction = function() {
        resultsContainer.style.display = 'none';
        predictionForm.reset();
        predictionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    // Form validation on input
    const inputs = predictionForm.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
    
    // Validate individual input
    function validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        // Remove existing error styling
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Validate if input has value
        if (input.value.trim() !== '') {
            if (isNaN(value) || value < min || value > max) {
                input.classList.add('error');
                showFieldError(input, `Value must be between ${min} and ${max}`);
            }
        }
    }
    
    // Show field error
    function showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = '#e53e3e';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
    }
    
    // Auto-fill demo data function
    window.fillDemoData = function() {
        const demoData = {
            pregnancies: 2,
            glucose: 120,
            blood_pressure: 70,
            skin_thickness: 20,
            insulin: 80,
            bmi: 25.5,
            diabetes_pedigree: 0.5,
            age: 35
        };
        
        Object.entries(demoData).forEach(([key, value]) => {
            const input = document.getElementById(key);
            if (input) {
                input.value = value;
            }
        });
        
        if (window.DiabetesAI && window.DiabetesAI.showNotification) {
            window.DiabetesAI.showNotification('Demo data filled successfully!', 'success');
        }
    };
    
    // Add demo data button if in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const demoButton = document.createElement('button');
        demoButton.type = 'button';
        demoButton.className = 'btn btn-secondary';
        demoButton.innerHTML = '<i class="fas fa-flask"></i> Fill Demo Data';
        demoButton.onclick = window.fillDemoData;
        
        const formActions = document.querySelector('.form-actions');
        if (formActions) {
            formActions.appendChild(demoButton);
        }
    }
});

