from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

# بارگذاری متغیرهای محیطی از فایل .env
load_dotenv()

app = FastAPI(title="Dictionary app", root_path="/api")

# تنظیمات CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# خواندن توکن از متغیر محیطی
API_TOKEN = os.getenv("API_TOKEN")

BASE_API_URL = "https://api.majidapi.ir/tools/dictionary"


@app.get("/lookup")
async def lookup_word(
    word: str = Query(..., description="کلمه‌ای که می‌خوای معنی‌شو بگیری"),
    lang: str = Query("en", description="زبان، مثلاً en یا fa")
):
    if not API_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="توکن API تعریف نشده است. لطفاً آن را در فایل .env تنظیم کنید."
        )

    params = {
        "text": word,
        "lang": lang,
        "token": API_TOKEN
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(BASE_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            print("✅ MajidAPI response:", data)
    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP error: {e.response.status_code} {e.response.text}")
        # اگر توکن اشتباه بود یا چیزی مشابه
        raise HTTPException(
            status_code=401,
            detail=".توکن نا معتبر است یا ارسال نشده است"
        )
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=".مشکلی در ارتباط با سرور پیش آمده است"
        )

    if not data.get("result"):
        raise HTTPException(
            status_code=404,
            detail=".متاسفانه معنی برای این کلمه پیدا نکردیم"
        )

    cleaned_meanings = []
    for item in data["result"]:
        meaning = item.get("result", "").strip()
        example = item.get("word", "").strip()
        if meaning and example:
            cleaned_meanings.append({
                "example": example,
                "meaning": meaning
            })

    return {
        "word": word,
        "lang": lang,
        "meanings": cleaned_meanings
    }
