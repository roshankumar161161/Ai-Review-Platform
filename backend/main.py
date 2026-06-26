from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel


from services.youtube_service import (
    search_youtube_videos,
    get_video_ids,
    get_video_comments,
    get_product_comments
)
from services.gemini_service import analyze_comments

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    query: str


@app.get("/")
def home():
    return {
        "message": "AI Review Backend Running"
    }
@app.get("/search/{product}")
def search(product: str):
    return search_youtube_videos(product)

@app.get("/videos/{product}")
def videos(product: str):
    return get_video_ids(product)

@app.get("/comments/{video_id}")
def comments(video_id: str):
    return get_video_comments(video_id)

@app.get("/analyze/{video_id}")
def analyze_video(video_id: str):

    comments = get_video_comments(video_id)

    result = analyze_comments(comments,video_id)

    return {
        "analysis": result
    }

@app.post("/analyze")
def analyze(data: AnalyzeRequest):

    query = data.query.strip()

    if "youtube.com" in query or "youtu.be" in query:
        return {
            "type": "youtube",
            "message": "YouTube URL detected"
        }

    return {
        "type": "product",
        "message": "Product search detected"
    }
@app.get("/analyze-product/{product}")
def analyze_product(product: str):

    youtube_comments = get_product_comments(product)

    if not youtube_comments:
        return {"error": "No comments found"}
    
    reviews = youtube_comments 

    result = analyze_comments(reviews,product)

    return {
        "analysis": result,
        "youtube_count": len(youtube_comments)
        
    }