import os
import requests
from dotenv import load_dotenv

load_dotenv()



YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def search_youtube_videos(product_name):

    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": f"{product_name} full review",
        "type": "video",
        "maxResults": 3,
        "order": "viewCount",
        "key": YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params)
    
    return response.json()


def get_video_ids(product_name):

    data = search_youtube_videos(product_name)

    videos = []

    for item in data.get("items", []):
        title = item["snippet"]["title"].lower()

        product_words = product_name.lower().split()

        if not any(word in title for word in product_words):
            continue
        
        if not any(
            word in title
            for word in [
                "review",
                "reviews",
                "unboxing",
                "experience",
                "honest",
                "after",
                "opinion"
            ]
        ):
            continue

        videos.append({
            "video_id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"]
        })

    return videos


def get_video_comments(video_id):

    url = "https://www.googleapis.com/youtube/v3/commentThreads"

    comments = []
    next_page_token = None

    while True:

        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": 50,
            "textFormat": "plainText",
            "key": YOUTUBE_API_KEY
        }

        if next_page_token:
            params["pageToken"] = next_page_token

        response = requests.get(url, params=params)
        data = response.json()

        for item in data.get("items", []):
            snippet = item["snippet"]["topLevelComment"]["snippet"]

            comments.append({
                "text": snippet["textDisplay"],
                "likes": snippet["likeCount"]
            })

        next_page_token = data.get("nextPageToken")

        if not next_page_token:
            break

    return [c["text"] for c in comments]


def filter_comments(comments):

    filtered = []

    seen = set()

    for comment in comments:

        text = comment.strip()

        if text.lower() in [
            "first",
            "nice",
            "super",
            "awesome"
        ]:
            continue

        if len(text) < 15:
            continue

        if text.lower() in seen:
            continue

        seen.add(text.lower())

        filtered.append(text)

    return filtered[:150]

def get_product_comments(product_name):

    videos = get_video_ids(product_name)

    all_comments = []

    for video in videos:

        comments = get_video_comments(video["video_id"])

        all_comments.extend(comments)
    filtered_comments = filter_comments(all_comments)
    return filtered_comments