#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Mar 30 07:37:17 2025

@author: amit
"""

import json
import os

def combine_json_files(input_files, output_file):
    # Initialize an empty list to store all data
    combined_data = []
    
    # Loop through each input file
    for file_path in input_files:
        try:
            # Check if file exists
            if not os.path.exists(file_path):
                print(f"Warning: File {file_path} does not exist. Skipping.")
                continue
                
            # Open and read the file
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                
                # If the data is a list, extend combined_data
                if isinstance(data, list):
                    combined_data.extend(data)
                # If the data is a dictionary, append it to combined_data
                elif isinstance(data, dict):
                    combined_data.append(data)
                else:
                    print(f"Warning: Data in {file_path} is neither a list nor a dictionary. Skipping.")
                    
            print(f"Successfully processed: {file_path}")
            
        except json.JSONDecodeError:
            print(f"Error: File {file_path} is not a valid JSON file. Skipping.")
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
    
    # Write the combined data to the output file
    with open(output_file, 'w', encoding='utf-8') as outfile:
        json.dump(combined_data, outfile, indent=4)
    
    print(f"Successfully combined {len(input_files)} JSON files into {output_file}")

# Example usage
if __name__ == "__main__":
    # List your 10 JSON files here
    input_files = [
        "/home/amit/Downloads/whole date/busstand_qa.json",
        "/home/amit/Downloads/whole date/foodcourt_qa.json",
        "/home/amit/Downloads/whole date/historical_qa.json",
        "/home/amit/Downloads/whole date/hospital_qa.json",
        "/home/amit/Downloads/whole date/hostel_qa.json",
        "/home/amit/Downloads/whole date/hotel_questions.json",
        "/home/amit/Downloads/whole date/mall_qa.json",
        "/home/amit/Downloads/whole date/museum_qa.json",
        "/home/amit/Downloads/whole date/police_station_qa.json",
        "/home/amit/Downloads/whole date/restaurants_qa.json",
          "/home/amit/Downloads/whole date/tourist_places_qa.json"
    ]
    
    # Specify the output file
    output_file = "combined_output.json"
    
    # Run the function
    combine_json_files(input_files, output_file)
