from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import json
import numpy as np
from .models import PatientData, PredictionResult
from .ml_model import DiabetesPredictor

# Initialize the ML model
predictor = DiabetesPredictor()

def home(request):
    """Home page view"""
    return render(request, 'predictor/home.html')

def about(request):
    """About page view"""
    return render(request, 'predictor/about.html')

def services(request):
    """Services page view"""
    return render(request, 'predictor/services.html')

def prediction_form(request):
    """Diabetes prediction form page"""
    return render(request, 'predictor/prediction_form.html')

@csrf_exempt
def predict_diabetes(request):
    """API endpoint for diabetes prediction"""
    if request.method == 'POST':
        try:
            # Get data from POST request
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST
            
            # Extract patient data
            patient_data = {
                'pregnancies': float(data.get('pregnancies', 0)),
                'glucose': float(data.get('glucose', 0)),
                'blood_pressure': float(data.get('blood_pressure', 0)),
                'skin_thickness': float(data.get('skin_thickness', 0)),
                'insulin': float(data.get('insulin', 0)),
                'bmi': float(data.get('bmi', 0)),
                'diabetes_pedigree': float(data.get('diabetes_pedigree', 0)),
                'age': int(data.get('age', 0))
            }
            
            # Save patient data
            patient_record = PatientData.objects.create(**patient_data)
            
            # Make prediction
            features = np.array([[
                patient_data['pregnancies'],
                patient_data['glucose'],
                patient_data['blood_pressure'],
                patient_data['skin_thickness'],
                patient_data['insulin'],
                patient_data['bmi'],
                patient_data['diabetes_pedigree'],
                patient_data['age']
            ]])
            
            prediction, probability = predictor.predict(features)
            
            # Save prediction result
            PredictionResult.objects.create(
                patient_data=patient_record,
                prediction=bool(prediction[0]),
                probability=float(probability[0])
            )
            
            # Return JSON response
            return JsonResponse({
                'success': True,
                'prediction': bool(prediction[0]),
                'probability': float(probability[0]),
                'message': 'Diabetic' if prediction[0] else 'Non-diabetic'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def prediction_history(request):
    """View to display prediction history"""
    predictions = PredictionResult.objects.all().order_by('-created_at')[:10]
    return render(request, 'predictor/history.html', {'predictions': predictions})

