#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Mar 29 10:40:52 2025

@author: amit
"""

model_id="google/flan-t5-small"
#model_id="google/flan-t5-xl"
#model_id="google/flan-t5-xxl"
peft_model_id="results-ft-model"
data_train="/home/amit/link_2/train"
data_evals="/home/amit/link_2/eval"
logs_output_dir="logs"






peft_model_id="results-ft-model"
data_eval="data/eval"
output_csv= "./20231206_finetuned_evals.csv"
prompt_instruction="Input: " # or ""

import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import pandas as pd
from datasets import load_from_disk





from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
tokenizer = AutoTokenizer.from_pretrained(model_id)

from datasets import load_from_disk
from random import randrange
train_ds= load_from_disk(data_train)
eval_ds=load_from_disk(data_evals)

# Your model loading and configuration code doesn't need changes
from transformers import AutoModelForSeq2SeqLM
model = AutoModelForSeq2SeqLM.from_pretrained(model_id, load_in_8bit=True, device_map="auto")

 

from peft import LoraConfig, get_peft_model, prepare_model_for_int8_training, TaskType
lora_config = LoraConfig(
 r=16,
 lora_alpha=32,
 target_modules=["q", "v"],
 lora_dropout=0.1,
 bias="none",
 task_type=TaskType.SEQ_2_SEQ_LM
)
model = prepare_model_for_int8_training(model)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()



# Add this preprocessing function after loading your datasets

def preprocess_function(examples):
    # For sequence-to-sequence models like T5, you need input_ids and labels
    # Assuming your dataset has 'input' and 'output' or 'question' and 'answer' fields
    # Adjust these field names based on your actual dataset structure
    
    # Check what fields are available in your dataset
    print("Available fields in dataset:", list(examples.keys()))
    
    # Use appropriate field names from your dataset
    # If you have 'question'/'answer' fields:
    inputs = examples.get('question', examples.get('input', examples.get('text', [])))
    targets = examples.get('answer', examples.get('output', examples.get('label', [])))
    
    # Handle possible nested list structure
    if isinstance(inputs, list) and inputs and isinstance(inputs[0], list):
        inputs = [item[0] if isinstance(item, list) and item else item for item in inputs]
    
    # Ensure we're working with strings
    inputs = [str(item) if item is not None else "" for item in inputs]
    targets = [str(item) if item is not None else "" for item in targets]
    
    # Add instruction prefix if needed
    if prompt_instruction:
        inputs = [prompt_instruction + inp for inp in inputs]
    
    # Tokenize inputs and targets
    model_inputs = tokenizer(
        inputs, 
        max_length=512,
        padding="max_length",
        truncation=True,
        return_tensors="pt"
    )
    
    # Tokenize the targets
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(
            targets,
            max_length=128,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        ).input_ids
    
    # Replace padding token id with -100 so it's ignored in loss calculation
    labels = [
        [(label if label != tokenizer.pad_token_id else -100) for label in label_seq]
        for label_seq in labels
    ]
    
    model_inputs["labels"] = labels
    return model_inputs

# Apply preprocessing to your datasets
print("Preprocessing training dataset...")
train_ds = train_ds.map(
    preprocess_function,
    batched=True,
    remove_columns=train_ds.column_names  # Remove original columns
)

print("Preprocessing evaluation dataset...")
eval_ds = eval_ds.map(
    preprocess_function,
    batched=True,
    remove_columns=eval_ds.column_names  # Remove original columns
)

# Verify the processed datasets
print("Processed training dataset:", train_ds)
print("Processed evaluation dataset:", eval_ds)











from transformers import DataCollatorForSeq2Seq
label_pad_token_id = -100
data_collator = DataCollatorForSeq2Seq(
    tokenizer,
    model=model,
    label_pad_token_id=label_pad_token_id,
    pad_to_multiple_of=8
)



# Add after your imports
from transformers.trainer_callback import TrainerCallback
import time
import numpy as np

# Custom callback for better progress tracking
class TrainingProgressCallback(TrainerCallback):
    def __init__(self):
        self.training_start_time = None
        self.last_log_time = None
    
    def on_train_begin(self, args, state, control, **kwargs):
        self.training_start_time = time.time()
        self.last_log_time = self.training_start_time
        print(f"\n{'='*80}")
        print(f"Starting fine-tuning FLAN-T5 with LoRA for {args.num_train_epochs} epochs")
        print(f"{'='*80}")
        
    def on_epoch_begin(self, args, state, control, **kwargs):
        current_epoch = int(state.epoch) + 1
        print(f"\n{'='*50}")
        print(f"Epoch {current_epoch}/{args.num_train_epochs}")
        print(f"{'='*50}")
        
    def on_log(self, args, state, control, logs=None, **kwargs):
        if logs is None:
            return
        
        current_time = time.time()
        total_elapsed = current_time - self.training_start_time
        
        # Format time as hours:minutes:seconds
        hours = int(total_elapsed // 3600)
        minutes = int((total_elapsed % 3600) // 60)
        seconds = int(total_elapsed % 60)
        
        # Extract and display metrics
        metrics_str = []
        
        if 'loss' in logs:
            metrics_str.append(f"Loss: {logs['loss']:.4f}")
            
        if 'eval_loss' in logs:
            metrics_str.append(f"Eval Loss: {logs['eval_loss']:.4f}")
            
        if 'learning_rate' in logs:
            metrics_str.append(f"LR: {logs['learning_rate']:.2e}")
        
        # Calculate speed and ETA
        if state.max_steps > 0:
            progress = state.global_step / state.max_steps
            eta_seconds = total_elapsed / progress - total_elapsed if progress > 0 else 0
            eta_h = int(eta_seconds // 3600)
            eta_m = int((eta_seconds % 3600) // 60)
            eta_s = int(eta_seconds % 60)
            
            speed = state.global_step / total_elapsed if total_elapsed > 0 else 0
            metrics_str.append(f"Speed: {speed:.2f} steps/s")
            metrics_str.append(f"ETA: {eta_h:02d}:{eta_m:02d}:{eta_s:02d}")
        
        print(f"Step: {state.global_step}/{state.max_steps} | " 
              f"Time: {hours:02d}:{minutes:02d}:{seconds:02d} | "
              f"{' | '.join(metrics_str)}")
        
        self.last_log_time = current_time
        
    def on_train_end(self, args, state, control, **kwargs):
        total_time = time.time() - self.training_start_time
        hours = int(total_time // 3600)
        minutes = int((total_time % 3600) // 60)
        seconds = int(total_time % 60)
        
        print(f"\n{'='*80}")
        print(f"Training completed in {hours:02d}:{minutes:02d}:{seconds:02d}")
        print(f"{'='*80}\n")



# Update training arguments for more frequent logging
training_args = Seq2SeqTrainingArguments(
    output_dir=logs_output_dir,
    auto_find_batch_size=True,
    learning_rate=5e-5,
    num_train_epochs=5,
    logging_dir=f"{logs_output_dir}/logs",
    logging_strategy="steps",
    logging_steps=20,  # More frequent logging for better visibility
    save_strategy="epoch",
    evaluation_strategy="epoch",
    report_to="tensorboard",
    # Add these parameters for better console output
    disable_tqdm=False,  # Show progress bars
    prediction_loss_only=False,  # Show more metrics
    remove_unused_columns=False,  # Keep all data columns
    # Add generation metrics for sequence-to-sequence models
    generation_max_length=128,
    predict_with_generate=True,
)

# Update trainer with our custom callback
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=train_ds,
    eval_dataset=eval_ds,
    callbacks=[TrainingProgressCallback()]  # Add our custom callback
)


model.config.use_cache = False
trainer.train()

trainer.model.save_pretrained("./T5-fine-tuned-modelG")
tokenizer.save_pretrained("./T5-fine-tuned-modelG")












# Update training arguments to include evaluation
from transformers import Seq2SeqTrainer, Seq2SeqTrainingArguments
training_args = Seq2SeqTrainingArguments(
    output_dir=logs_output_dir,
    auto_find_batch_size=True,
    learning_rate=5e-5,
    num_train_epochs=10,
    logging_dir=f"{logs_output_dir}/logs",
    logging_strategy="steps",
    logging_steps=100,
    save_strategy="epoch",  # Changed from "no" to save at each epoch
    evaluation_strategy="epoch",  # Add this to evaluate at each epoch
    report_to="tensorboard",
)

# Update trainer to use your new dataset variables
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=train_ds,  # Changed from ds to train_ds
    eval_dataset=eval_ds,    # Added eval_ds
)

model.config.use_cache = False
trainer.train()

trainer.model.save_pretrained("./T5-fine-tuned-modelF")
tokenizer.save_pretrained("./T5-fine-tuned-modelF")




