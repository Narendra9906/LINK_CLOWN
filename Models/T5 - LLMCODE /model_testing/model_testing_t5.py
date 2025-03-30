#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Mar 29 11:14:49 2025

@author: amit

















"""



from transformers import AutoTokenizer
from peft import PeftModel
from transformers import AutoModelForSeq2SeqLM
import torch
import random

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("./T5-fine-tuned-modelG")

# Load base model
base_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small", load_in_8bit=True, device_map="auto")

# Load LoRA configuration and model
peft_model = PeftModel.from_pretrained(base_model, "./T5-fine-tuned-modelG")

# Set to evaluation mode
peft_model.eval()

peft_model_id="results-ft-model"
data_train="/home/amit/link_2/train"
data_evals="/home/amit/link_2/eval"
logs_output_dir="logs"


train_ds= load_from_disk(data_train)
eval_ds=load_from_disk(data_evals)



# Print the first example from your dataset to see its structure
test_example = eval_ds[0]
print("Available keys in dataset:", test_example.keys())
print("First example content:", test_example)



# Function to generate answers from questions



# Function to generate answers from questions (UPDATED VERSION)
def generate_answer(question):
    prompt = f"Input: {question}"
    inputs = tokenizer(prompt, return_tensors="pt").to(peft_model.device)
    
    with torch.no_grad():
        # Use keyword arguments as suggested in my previous message
        outputs = peft_model.generate(
            input_ids=inputs.input_ids,  # Use keyword argument here
            max_length=150,
            num_beams=4,
            early_stopping=True
        )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)





# First, make sure you have access to your tokenizer
# If you don't have it defined already, add:
# tokenizer = AutoTokenizer.from_pretrained("your-model-name")

test_indices = random.sample(range(len(eval_ds)), 10)
for idx in test_indices:
    test_example = eval_ds[idx]
    
    # Decode the input_ids to get the original question text
    input_text = tokenizer.decode(test_example["input_ids"], skip_special_tokens=True)
    
    # Decode the labels to get the ground truth answer
    # Filter out -100 values which are used as padding/ignored positions
    labels = [label for label in test_example["labels"] if label != -100]
    ground_truth = tokenizer.decode(labels, skip_special_tokens=True)
    
    # Generate prediction using your model
    # This depends on how your generate_answer function is implemented
    predicted_answer = generate_answer(input_text)  # Make sure this function works with text not tokens
    
    print(f"\nInput text: {input_text}")
    print(f"Ground truth: {ground_truth}")
    print(f"Model prediction: {predicted_answer}")





























# First, let's inspect the structure of a sample from your dataset
test_example = eval_ds[0]  # Look at the first item in the dataset
print("Available keys in dataset:", test_example.keys())
print("Sample content:", test_example)

# Then try again with the correct keys
test_indices = random.sample(range(len(eval_ds)), 10)
for idx in test_indices:
    test_example = eval_ds[idx]
    
    # Get the keys dynamically based on your dataset structure
    # Common key names might be: input_text, inputs, text, source, question_text, etc.
    # And for answers: output, target, label, answer_text, etc.
    
    # For example, if your keys are 'input' and 'output':
    # question = test_example["input"]
    # ground_truth = test_example["output"]
    
    # Replace these with the actual keys from your dataset
    input_key = list(test_example.keys())[0]  # First key (adjust if needed)
    output_key = list(test_example.keys())[1]  # Second key (adjust if needed)
    
    question = test_example[input_key]
    ground_truth = test_example[output_key]
    
    # Generate prediction
    predicted_answer = generate_answer(question)
    
    print(f"\nQuestion ({input_key}): {question}")
    print(f"Ground truth ({output_key}): {ground_truth}")
    print(f"Model prediction: {predicted_answer}")






















# Test with 5 random examples from the eval dataset
test_indices = random.sample(range(len(eval_ds)), 10)
for idx in test_indices:
    test_example = eval_ds[idx]
    
    # Using the correct key "question" 
    question = test_example["question"]
    
    # Using the correct key "answer"
    ground_truth = test_example["answer"]
    
    # Generate prediction using the updated function
    predicted_answer = generate_answer(question)
    
    print(f"\nQuestion: {question}")
    print(f"Ground truth: {ground_truth}")
    print(f"Model prediction: {predicted_answer}")
    
    
    
    
    
    
if len(eval_ds) >= 5:
    test_indices = random.sample(range(len(eval_ds)), 5)
else:
    # Either use all indices if fewer than 5
    test_indices = list(range(len(eval_ds)))
    # Or handle the case appropriately
    print(f"Warning: Dataset only has {len(eval_ds)} examples, using all of them.")
    


## to ask the questions form the user 


def interactive_qa():
    print("Ask questions to your fine-tuned model (type 'exit' to quit):")
    while True:
        question = input("\nYour question: ")
        if question.lower() in ["exit", "quit", "q"]:
            break
            
        answer = ask_model(question)
        print(f"Model answer: {answer}")

# Run the interactive session
interactive_qa()





































# Test with 5 random examples from the eval dataset
test_indices = random.sample(range(len(eval_ds)), 5)
for idx in test_indices:
    test_example = eval_ds[idx]
    question = test_example["input"].replace("Input: ", "")  # Remove the instruction prefix if it exists
    
    # Get ground truth answer
    ground_truth = tokenizer.decode(test_example["labels"], skip_special_tokens=True)
    ground_truth = ground_truth.replace("<pad>", "").strip()
    
    # Generate prediction
    predicted_answer = generate_answer(question)
    
    print(f"\nQuestion: {question}")
    print(f"Ground truth: {ground_truth}")
    print(f"Model prediction: {predicted_answer}")


































from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
tokenizer = AutoTokenizer.from_pretrained(model_id)

from datasets import load_from_disk
from random import randrange
# Now test the model with a few examples from the test set
print("\nTesting the fine-tuned model with examples from the test set:")

# Load the fine-tuned model for inference
from peft import PeftModel, PeftConfig
from transformers import AutoModelForSeq2SeqLM

# Load base model
base_model = AutoModelForSeq2SeqLM.from_pretrained(
    model_id, 
    load_in_8bit=True, 
    device_map="auto"
)

# Load PEFT configuration
peft_config = PeftConfig.from_pretrained(peft_model_id)

# Load the fine-tuned model
fine_tuned_model = PeftModel.from_pretrained(
    base_model, 
    peft_model_id
)

# Set to evaluation mode
fine_tuned_model.eval()

# Function to generate answers from questions
def generate_answer(question):
    prompt = f"Input: {question}"
    inputs = tokenizer(prompt, return_tensors="pt").to(fine_tuned_model.device)
    
    with torch.no_grad():
        outputs = fine_tuned_model.generate(
            inputs.input_ids,
            max_length=150,
            num_beams=4,
            early_stopping=True
        )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Test with 5 random examples from the eval dataset
import random
import torch

test_indices = random.sample(range(len(eval_ds)), 5)
for idx in test_indices:
    test_example = eval_ds[idx]
    question = test_example["input"].replace("Input: ", "")  # Remove the instruction prefix if it exists
    
    # Get ground truth answer
    ground_truth = tokenizer.decode(test_example["labels"], skip_special_tokens=True)
    ground_truth = ground_truth.replace("<pad>", "").strip()
    
    # Generate prediction
    predicted_answer = generate_answer(question)
    
    print(f"\nQuestion: {question}")
    print(f"Ground truth: {ground_truth}")
    print(f"Model prediction: {predicted_answer}")