
import os
import json
from flask import Flask, render_template, jsonify, request
import google.generativeai as genai

app = Flask(__name__)

# Configure Gemini API
# The API key is obtained from the environment variable as per instructions
genai.configure(api_key=os.environ.get("API_KEY"))

# Mock User Data (Based on the provided JSON structure)
USER_DATA = {
    "_id": {"$oid": "6998a8cfcf1b460b34615c33"},
    "Name": "Aditya Sharma",
    "email": "aditya@example.com",
    "Age": "21",
    "employement-status": "Salaried",
    "Goal": {
        "goal": "Luxury Car",
        "target-amt": 2100000,
        "target-time": 24
    },
    "financials": {
        "monthly-income": 150000,
        "monthly-expenses": 45000,
        "debt": 12000,
        "em-fund-opted": True
    },
    "investments": {
        "risk-opt": "Medium",
        "prefered-mode": "Lumpsum",
        "invest-amt": 500000
    },
    "progress": {
        "tenure": 1,
        "start_date": "2024-02-20",
        "auto-adjust": False
    },
    "onboarding": {
        "status": "completed",
        "current_step": None,
        "last_updated": "2024-02-20T18:33:53.678600"
    }
}

@app.route('/')
def index():
    """Serves the main dashboard page."""
    return render_template('index.html')

@app.route('/api/user-data')
def get_user_data():
    """Returns the current user's financial data."""
    return jsonify(USER_DATA)

@app.route('/api/insights', methods=['POST'])
def get_insights():
    """Generates AI financial insights using Gemini."""
    try:
        data = request.json
        prompt = f"""
        Analyze the following financial data for a user in India. 
        All values are in Indian Rupees (INR).
        User: {data['Name']}, Age: {data['Age']}
        Monthly Income: {data['financials']['monthly-income']}
        Monthly Expenses: {data['financials']['monthly-expenses']}
        Monthly Debt: {data['financials']['debt']}
        Goal: {data['Goal']['goal']} (Target: {data['Goal']['target-amt']} in {data['Goal']['target-time']} months)
        Current Investment: {data['investments']['invest-amt']}
        Risk Profile: {data['investments']['risk-opt']}

        Provide 6 professional financial insights and actionable suggestions. 
        Return the response as a JSON array of objects with keys: 'title', 'description', 'type' (positive, warning, info, suggestion), 'category' (Goal, Tax, Savings, Investment, Debt), and 'impact' (High, Medium, Low).
        Include specific advice on:
        1. Monthly SIP needed for the goal.
        2. Tax saving (80C/80D).
        3. Emergency fund status.
        4. Debt-to-income ratio.
        5. Asset allocation for a {data['investments']['risk-opt']} risk profile.
        """

        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        # Clean the response text to ensure it's valid JSON
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:-3].strip()
        
        return jsonify(json.loads(text))
    except Exception as e:
        print(f"Error generating insights: {e}")
        # Fallback insights if API fails
        return jsonify([
            {
                "title": "Goal Feasibility",
                "description": "To reach ₹21L in 24 months, you need a monthly SIP of approx ₹75,000 assuming 12% CAGR.",
                "type": "info",
                "category": "Goal",
                "impact": "High"
            },
            {
                "title": "Emergency Fund",
                "description": "Maintain at least ₹2.7L (6 months of expenses) in a liquid fund.",
                "type": "suggestion",
                "category": "Savings",
                "impact": "High"
            }
        ])

if __name__ == '__main__':
    # Running on port 5000 by default
    app.run(debug=True, port=5000)
