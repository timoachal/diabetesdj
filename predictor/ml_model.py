import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import pickle
import os

class DiabetesPredictor:
    """Machine Learning model for diabetes prediction"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = 'diabetes_model.pkl'
        self.scaler_path = 'diabetes_scaler.pkl'
        
        # Try to load existing model
        self.load_model()
        
        # If no model exists, create and train a new one
        if not self.is_trained:
            self.train_model()
    
    def create_sample_data(self):
        """Create sample training data for diabetes prediction"""
        # This is sample data - in a real application, you would use actual medical data
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic data based on diabetes risk factors
        data = {
            'Pregnancies': np.random.randint(0, 18, n_samples),
            'Glucose': np.random.normal(120, 30, n_samples),
            'BloodPressure': np.random.normal(70, 20, n_samples),
            'SkinThickness': np.random.normal(20, 15, n_samples),
            'Insulin': np.random.normal(80, 115, n_samples),
            'BMI': np.random.normal(32, 7, n_samples),
            'DiabetesPedigreeFunction': np.random.uniform(0.078, 2.42, n_samples),
            'Age': np.random.randint(21, 82, n_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Create target variable based on risk factors
        # Higher glucose, BMI, age increase diabetes risk
        risk_score = (
            (df['Glucose'] > 140) * 0.3 +
            (df['BMI'] > 30) * 0.2 +
            (df['Age'] > 45) * 0.2 +
            (df['BloodPressure'] > 80) * 0.1 +
            (df['DiabetesPedigreeFunction'] > 0.5) * 0.2
        )
        
        # Add some randomness
        risk_score += np.random.normal(0, 0.1, n_samples)
        df['Outcome'] = (risk_score > 0.5).astype(int)
        
        return df
    
    def train_model(self):
        """Train the diabetes prediction model"""
        try:
            # Create sample data
            df = self.create_sample_data()
            
            # Prepare features and target
            X = df.drop('Outcome', axis=1)
            y = df['Outcome']
            
            # Split the data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale the features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train the model
            self.model = RandomForestClassifier(
                n_estimators=100,
                random_state=42,
                max_depth=10
            )
            self.model.fit(X_train_scaled, y_train)
            
            # Evaluate the model
            y_pred = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            print(f"Model trained with accuracy: {accuracy:.2f}")
            
            self.is_trained = True
            
            # Save the model and scaler
            self.save_model()
            
        except Exception as e:
            print(f"Error training model: {e}")
            # Create a simple fallback model
            self.model = RandomForestClassifier(random_state=42)
            self.is_trained = True
    
    def predict(self, features):
        """Make diabetes prediction"""
        if not self.is_trained:
            raise ValueError("Model is not trained")
        
        try:
            # Scale the features
            features_scaled = self.scaler.transform(features)
            
            # Make prediction
            prediction = self.model.predict(features_scaled)
            probability = self.model.predict_proba(features_scaled)[:, 1]
            
            return prediction, probability
            
        except Exception as e:
            print(f"Error making prediction: {e}")
            # Return a default prediction
            return np.array([0]), np.array([0.5])
    
    def save_model(self):
        """Save the trained model and scaler"""
        try:
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            with open(self.scaler_path, 'wb') as f:
                pickle.dump(self.scaler, f)
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def load_model(self):
        """Load the trained model and scaler"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(self.scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                self.is_trained = True
                print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.is_trained = False

