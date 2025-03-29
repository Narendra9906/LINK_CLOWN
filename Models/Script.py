from transformers import AutoTokenizer
from peft import PeftModel
from transformers import AutoModelForSeq2SeqLM
import torch

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("Models/T5-fine-tuned-model")

# Load base model
base_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small", load_in_8bit=True, device_map="auto")

# Load LoRA configuration and model
peft_model = PeftModel.from_pretrained(base_model, "./T5-fine-tuned-model")

# Set to evaluation mode
peft_model.eval()

##  code to use  it in the backend 
def ask_model(question_text):
    """
    Function to ask a question to the fine-tuned model and get a response.
    
    Args:
        question_text (str): The question to ask the model
        
    Returns:
        str: The model's answer
    """
    prompt = f"Input: {question_text}"
    inputs = tokenizer(prompt, return_tensors="pt").to(peft_model.device)
    
    with torch.no_grad():
        # Using keyword arguments for generate
        outputs = peft_model.generate(
            input_ids=inputs.input_ids,
            max_length=150,
            num_beams=4,
            early_stopping=True
        )
    
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return answer


# Example usage in your backend
def process_user_query(user_question):
    # Pre-process the question if needed
    
    # Get answer from the model
    model_response = ask_model(user_question)
    
    # Post-process the response if needed
    
    return model_response

# Example
question = "What are the popular food, snacks, and sweets of Varanasi?"
answer = process_user_query(question)
print(f"Question: {question}")
print(f"Answer: {answer}")