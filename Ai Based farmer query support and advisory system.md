# AI-Based Farmer Query Support and Advisory System

## Project Title

**AI-Based Farmer Query Support and Advisory System**

---

## Problem Statement

Farmers often face challenges in obtaining timely and accurate agricultural information regarding crop cultivation, pest control, fertilizer usage, irrigation management, and weather conditions. Due to limited access to agricultural experts, many farmers make decisions based on incomplete information, which can result in reduced crop yield and financial losses. This project aims to develop an AI-powered advisory system that provides instant and reliable recommendations to farmers based on their queries.

---

## Project Objectives

1. To provide instant agricultural advice to farmers.
2. To assist farmers in making informed decisions regarding crop management.
3. To offer recommendations related to fertilizers, pesticides, and irrigation.
4. To provide weather-based farming suggestions.
5. To reduce dependency on manual consultation.
6. To support text-based and voice-based farmer queries.
7. To improve crop productivity and farming efficiency using AI technologies.

---

## Models Used

### 1. Natural Language Processing (NLP)

* Used to understand and process farmer queries.
* Identifies keywords and extracts useful information from user input.

### 2. Query Classification Model

* Classifies farmer queries into categories such as:

  * Crop Information
  * Fertilizer Recommendation
  * Pest and Disease Management
  * Irrigation Guidance
  * Weather Advisory

### 3. Recommendation Engine

* Generates appropriate farming recommendations based on the identified query category.

### 4. Keyword Matching Algorithm

* Matches farmer queries with predefined agricultural knowledge stored in the database.

---

## Technology Stack

| Component        | Technology                        |
| ---------------- | --------------------------------- |
| Frontend         | HTML, CSS, JavaScript             |
| Backend          | Python Flask                      |
| Database         | MySQL                             |
| AI Module        | Natural Language Processing (NLP) |
| Development Tool | Visual Studio Code                |

---

## Table List

### Table 1: Farmer Details

| Field Name    | Data Type |
| ------------- | --------- |
| Farmer_ID     | INT       |
| Farmer_Name   | VARCHAR   |
| Mobile_Number | VARCHAR   |
| Location      | VARCHAR   |

### Table 2: Query Details

| Field Name     | Data Type |
| -------------- | --------- |
| Query_ID       | INT       |
| Farmer_ID      | INT       |
| Query_Text     | TEXT      |
| Query_Category | VARCHAR   |
| Query_Date     | DATE      |

### Table 3: Advisory Details

| Field Name     | Data Type |
| -------------- | --------- |
| Advisory_ID    | INT       |
| Query_ID       | INT       |
| Recommendation | TEXT      |
| Created_Date   | DATE      |

### Table 4: Crop Information

| Field Name        | Data Type |
| ----------------- | --------- |
| Crop_ID           | INT       |
| Crop_Name         | VARCHAR   |
| Fertilizer        | VARCHAR   |
| Irrigation_Method | VARCHAR   |
| Disease_Control   | TEXT      |

---

## Expected Outcome

The system will provide farmers with accurate, timely, and AI-driven agricultural recommendations, helping them improve crop yield, reduce losses, and adopt modern farming practices.
