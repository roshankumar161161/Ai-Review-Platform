import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_comments(comments,product_name):

    prompt = f"""
        You are an AI product review analyst.
       Target Product: {product_name}

        The comments are collected from YouTube review videos of the target product.

        Assume that comments without an explicit product name are referring to the target product unless they clearly discuss a different product.

        Ignore only comments that are clearly unrelated to the target product.

        If another brand is mentioned only for comparison, include it in the analysis.
        
        Instructions:
        - Consider only meaningful product-related reviews.
        - Ignore spam, emoji-only comments, greetings, "first", "nice", "super", creator appreciation, advertisements, unrelated discussions, and duplicate comments.
        - Identify important product aspects dynamically. Do not assume fixed categories.
        - Determine the overall sentiment:
        - Positive if positive reviews are more than negative reviews.
        - Negative if negative reviews are more than positive reviews.
        - Mixed only if the counts are very close (difference less than 10%).
        - Summarize the overall user opinion in 3-5 sentences.
        - List the major pros and cons.
        - Extract the most relevant keywords from the reviews.

        Classify every meaningful review as either:
        - Positive
        - Negative

        Do NOT use Neutral.

        If a review contains both positive and negative opinions, classify it based on the dominant opinion.

       Count the number of meaningful reviews.

        Calculate sentiment percentages.

        Return:

        - positive = Positive percentage (0-100)
        - negative = Negative percentage (0-100)

        The sum of positive and negative must always equal 100.

        Example:
        Positive reviews = 30
        Negative reviews = 70

        Return:

        "positive": 30,
        "negative": 70


        AI Recommendation

        Based on all meaningful reviews, decide whether the product is:

        - Worth Buying
        - Buy with Caution
        - Not Recommended

        Rules:

        - Worth Buying:
        Positive reviews are significantly higher than negative reviews and there are no major recurring issues.

        - Buy with Caution:
        Positive and negative reviews are mixed, or there are some important issues that buyers should know.

        - Not Recommended:
        Negative reviews dominate or there are serious recurring problems.

        Also generate:

        - confidence (0-100)
        - exactly 3 reasons.

        Rules for reasons:
        - Each reason must be ONE short sentence only.
        - Maximum 8 to 12 words.
        - Mention only the most important point.
        - Do not explain in detail.
        - Do not use long paragraphs.

        Example:

        "reasons": [
          "Battery backup is below average.",
          "Heating issues are frequently reported.",
          "Performance is poor for the price."
        ]
        IMPORTANT:

        Each recommendation reason must be very short.

        Maximum 6 words per reason.

        Examples:
        - Excellent battery life
        - Expensive for the features
        - Camera performs well

        Do not write long sentences.

        Return:

        "recommendation": {{
        "status": "",
        "confidence": 0,
        "reasons": []
        }}
        Return ONLY valid JSON.
        Do not include markdown, explanation or ```json blocks.

        Return ONLY valid JSON in this format:

        {{
          "sentiment": "",
          "positive": 0,
          "negative": 0,
          "summary": "",
          "pros": [],
          "cons": [],
          "keywords": [],
          "recommendation":{{
            "status": "",
            "confidence": 0,
            "reasons": []
          }},
          "aspects": {{}}
        }}

        Comments:
        {comments}
    """

    try:
        response = model.generate_content(prompt)

        cleaned = response.text.replace("```json", "").replace("```", "").strip()
        
        
        return json.loads(cleaned)
        

    except Exception as e:
        print("Gemini Error:", e)
        return {
            "sentiment": "Error",
            "positive": 0,
            "negative": 0,
            "summary": str(e),
            "pros": [],
            "cons": [],
            "keywords": [],
            "recommendation":{
                "status": "",
                "confidence": 0,
                "reasons": []
          },
            "aspects": {}
        }