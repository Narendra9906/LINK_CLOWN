#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 24 21:56:57 2025

@author: amit
"""

# 1_data_preparation.py
# 1_data_preparation.py
# 1_data_preparation.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import json
import os

# Create directory for processed data
os.makedirs('processed_data', exist_ok=True)

# Load your data from the JSON file
json_file_path = '/home/amit/combined_output.json'  # Update this path to your JSON file

try:
    # Load the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        json_data = json.load(file)
    
    # Convert JSON to DataFrame
    travel_data = pd.DataFrame(json_data)
    
    print(f"Dataset loaded from {json_file_path}")
    print(f"Dataset contains {len(travel_data)} rows")
    print(f"Number of questions: {len(travel_data['question']) if 'question' in travel_data.columns else 0}")
    print(f"Number of answers: {len(travel_data['answer']) if 'answer' in travel_data.columns else 0}")
    
    # Display the first few rows to verify data
    print("\nSample data:")
    print(travel_data.head(2))
    
    # Check if required columns exist
    required_columns = ['question', 'answer']
    missing_columns = [col for col in required_columns if col not in travel_data.columns]
    if missing_columns:
        print(f"Warning: Missing required columns: {missing_columns}")
        print("Available columns:", travel_data.columns.tolist())
    
    # Split into training, validation, and test sets
    train_data, temp_data = train_test_split(travel_data, test_size=0.3, random_state=42)
    val_data, test_data = train_test_split(temp_data, test_size=0.5, random_state=42)
    print(f"Data split complete. Training: {len(train_data)}, Validation: {len(val_data)}, Test: {len(test_data)}")
    
    # Save processed datasets
    train_data.to_csv('/home/amit/final_all/train.csv', index=False)
    val_data.to_csv('/home/amit/final_all/validation.csv', index=False)
    test_data.to_csv('/home/amit/final_all/test.csv', index=False)
    
    # Create a metadata file for reference
    metadata = {
        'dataset_size': len(travel_data),
        'train_size': len(train_data),
        'validation_size': len(val_data),
        'test_size': len(test_data),
        'columns': travel_data.columns.tolist(),
        'data_sample': travel_data.head(2).to_dict('records')
    }
    
    with open('/home/amit/final/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("Data preparation complete. Files saved to processed_data/")

except FileNotFoundError:
    print(f"Error: The file {json_file_path} was not found.")
except json.JSONDecodeError:
    print(f"Error: The file {json_file_path} is not a valid JSON file.")
except Exception as e:
    print(f"An error occurred: {str(e)}")
    
    
    
    
    
    
    
    
    
    
import pandas as pd

# Load the train.csv file
train_file_path = '/home/amit/final_all/train.csv'  # Update this path if needed

try:
    # Read the CSV file
    train_data = pd.read_csv(train_file_path)
    
    # Display basic information
    print(f"File loaded: {train_file_path}")
    print(f"Total rows in training data: {len(train_data)}")
    
    # Check for question and answer columns
    if 'question' in train_data.columns:
        print(f"Number of questions: {len(train_data['question'])}")
        print(f"Number of non-null questions: {train_data['question'].count()}")
        
        # Display a few question samples
        print("\nSample questions:")
        for i, question in enumerate(train_data['question'].head(3)):
            print(f"  {i+1}. {question}")
    else:
        print("Warning: 'question' column not found in the file")
    
    if 'answer' in train_data.columns:
        print(f"\nNumber of answers: {len(train_data['answer'])}")
        print(f"Number of non-null answers: {train_data['answer'].count()}")
        
        # Display a few answer samples
        print("\nSample answers:")
        for i, answer in enumerate(train_data['answer'].head(3)):
            print(f"  {i+1}. {answer}")
    else:
        print("Warning: 'answer' column not found in the file")
    
    # Display all column names
    print("\nAll columns in the file:")
    for col in train_data.columns:
        print(f"  - {col}")
    
    # Check for any missing values
    missing_values = train_data.isnull().sum()
    if missing_values.sum() > 0:
        print("\nMissing values by column:")
        for col, count in missing_values.items():
            if count > 0:
                print(f"  - {col}: {count} missing values")
    else:
        print("\nNo missing values found in the dataset.")
    
    # Get data types
    print("\nData types:")
    print(train_data.dtypes)
    
    # Print basic statistics
    print("\nBasic statistics for numeric columns (if any):")
    print(train_data.describe())
    
except FileNotFoundError:
    print(f"Error: The file {train_file_path} was not found.")
except Exception as e:
    print(f"An error occurred: {str(e)}")