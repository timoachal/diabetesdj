from django.db import models
from django.contrib.auth.models import User

class PatientData(models.Model):
    """Model to store patient data for diabetes prediction"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    pregnancies = models.IntegerField(help_text="Number of pregnancies")
    glucose = models.FloatField(help_text="Plasma glucose concentration")
    blood_pressure = models.FloatField(help_text="Diastolic blood pressure (mm Hg)")
    skin_thickness = models.FloatField(help_text="Triceps skin fold thickness (mm)")
    insulin = models.FloatField(help_text="2-Hour serum insulin (mu U/ml)")
    bmi = models.FloatField(help_text="Body mass index (weight in kg/(height in m)^2)")
    diabetes_pedigree = models.FloatField(help_text="Diabetes pedigree function")
    age = models.IntegerField(help_text="Age in years")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Patient Data - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class PredictionResult(models.Model):
    """Model to store diabetes prediction results"""
    patient_data = models.OneToOneField(PatientData, on_delete=models.CASCADE)
    prediction = models.BooleanField(help_text="Diabetes prediction (True = Diabetic, False = Non-diabetic)")
    probability = models.FloatField(help_text="Probability of being diabetic")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prediction - {'Diabetic' if self.prediction else 'Non-diabetic'} ({self.probability:.2%})"

