# STBI WordNet - Frontnend

This repository contains the frontend for the **STBI WordNet** application, a web-based application designed to experiment with improving text document search relevance through WordNet-based query expansion. The application enables users to perform document searches using input queries alongside their expanded forms, and provides detailed metrics on query expansion effectiveness. The frontend is built using **React** and styled with **Chakra UI**. It communicates with the backend API to perform document searches, display results, and visualize metrics associated with query expansions.

## Features

- **Document Management:** Upload and manage collections of text documents. View inverted indexes with various TF-IDF weighting schemes (raw TF, log TF, binary TF, augmented TF, IDF). Supports viewing original, stemmed, stop-word removed, or combined text processing variants.  
- **Interactive Search:** Perform searches with original and expanded queries. Display search results ranked by cosine similarity. Compare rankings, view expanded query terms, and analyze term weight differences. Configure weighting methods and text preprocessing options.  
- **Batch Search:** Run batch queries with relevance judgments. Automatically expand queries and calculate precision metrics such as average precision and mean average precision. Compare effectiveness between original and expanded query sets.  
- **Detailed Metrics:** Visualize term weighting and query expansion impact to aid in relevance evaluation.

## Prerequisites

- **Node.js**
- **npm** or **yarn**

## Frontend Setup

1.  Clone this repository:  
     ```bash
     git clone https://github.com/munzayanahusn/IF4042-QEWordNet-fronend.git
     ```
2. Navigate into the project directory:
     ```bash
     cd cd if4042-qewordnet-fronend
     ```
2. Install dependencies:  
     ```bash
     npm install
     ```
     or
     ```bash
     yarn install
     ```
4. run the frontend application:  
     ```bash
     npm run dev
     ```
5. Open the app in the browser at `http://localhost:5173`

## Authors
- [13521047] Muhammad Equilibrie Fajria  
- [13521053] Athif Nirwasito  
- [13521077] Husnia Munzayana  
- [13521115] Shelma Salsabila  
- [13521125] Asyifa Nurul Shafira  

