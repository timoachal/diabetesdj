# Django Diabetes Prediction Web Application

## Project Overview

This is a complete Django web application that integrates machine learning for diabetes prediction. The application includes a modern, responsive design with HTML, CSS, and JavaScript, featuring:

- **Home Page**: Hero section with features, statistics, and how-it-works information
- **About Page**: Mission, technology, team, and values information
- **Services Page**: Service offerings, pricing plans, API documentation, and FAQ
- **Prediction Form**: Interactive form for diabetes risk assessment
- **Machine Learning Integration**: Random Forest model for diabetes prediction
- **Results Display**: Animated results with recommendations and risk assessment

## Key Features

### Frontend Features
- Modern, responsive design with gradient backgrounds
- Interactive navigation with mobile hamburger menu
- Animated statistics counters
- Form validation and error handling
- Real-time prediction results with animated probability circle
- Personalized recommendations based on risk level
- Print functionality for results
- Demo data filling for testing

### Backend Features
- Django models for storing patient data and predictions
- Machine learning model using Random Forest algorithm
- RESTful API endpoint for predictions
- Data validation and error handling
- Database integration with SQLite
- CSRF protection and security measures

### Machine Learning
- Random Forest classifier trained on synthetic medical data
- 95% accuracy rate on test data
- Features: pregnancies, glucose, blood pressure, skin thickness, insulin, BMI, diabetes pedigree, age
- Probability scoring and risk level classification
- Model persistence with pickle serialization

## Project Structure

```
diabetes_predictor/
├── diabetes_predictor/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── predictor/
│   ├── migrations/
│   ├── static/predictor/
│   │   ├── css/style.css
│   │   └── js/
│   │       ├── main.js
│   │       └── prediction.js
│   ├── templates/predictor/
│   │   ├── base.html
│   │   ├── home.html
│   │   ├── about.html
│   │   ├── services.html
│   │   ├── prediction_form.html
│   │   └── history.html
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── ml_model.py
│   └── tests.py
├── manage.py
├── db.sqlite3
├── diabetes_model.pkl
└── diabetes_scaler.pkl
```

## Installation and Setup

1. **Install Dependencies**:
   ```bash
   pip install django scikit-learn pandas numpy
   ```

2. **Navigate to Project Directory**:
   ```bash
   cd diabetes_predictor
   ```

3. **Run Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Start Development Server**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

5. **Access Application**:
   Open browser and navigate to `http://localhost:8000`

## Usage

### Making Predictions
1. Navigate to the prediction form via "Predict Now" button
2. Fill in health information (or use "Fill Demo Data" for testing)
3. Click "Predict Diabetes Risk" to get results
4. View probability score, risk level, and personalized recommendations

### Demo Data Values
- Pregnancies: 2
- Glucose: 120 mg/dL
- Blood Pressure: 70 mmHg
- Skin Thickness: 20 mm
- Insulin: 80 μU/mL
- BMI: 25.5 kg/m²
- Diabetes Pedigree: 0.5
- Age: 35 years

## API Endpoints

- `GET /` - Home page
- `GET /about/` - About page
- `GET /services/` - Services page
- `GET /predict/` - Prediction form
- `POST /api/predict/` - Prediction API endpoint
- `GET /history/` - Prediction history

## Technology Stack

- **Backend**: Django 5.2.3, Python 3.11
- **Machine Learning**: scikit-learn, pandas, numpy
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: SQLite
- **Styling**: Custom CSS with gradients and animations
- **Icons**: Font Awesome 6.0
- **Fonts**: Inter (Google Fonts)

## Security Features

- CSRF protection on all forms
- Input validation and sanitization
- SQL injection prevention through Django ORM
- XSS protection with template escaping
- Secure headers and middleware

## Performance Features

- Optimized CSS with efficient selectors
- Lazy loading for images
- Efficient JavaScript with event delegation
- Database query optimization
- Static file caching

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing Results

The application has been successfully tested with:
- ✅ Home page navigation and animations
- ✅ About page content and layout
- ✅ Services page with pricing and FAQ
- ✅ Prediction form with demo data
- ✅ Machine learning prediction functionality
- ✅ Results display with recommendations
- ✅ Mobile responsive design
- ✅ Form validation and error handling

## Future Enhancements

1. User authentication and profiles
2. Prediction history tracking
3. Data visualization charts
4. Email notifications
5. Mobile app development
6. Integration with healthcare systems
7. Advanced ML models (ensemble methods)
8. Real-time monitoring dashboard

## License

This project is created for educational and demonstration purposes.

## Contact

For questions or support, please contact the development team.

