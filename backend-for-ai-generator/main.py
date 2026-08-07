from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

from dotenv import load_dotenv

load_dotenv()



client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)



app = FastAPI()



class PromptRequest(BaseModel):

    prompt:str





@app.post("/generate-image")
async def generate_image(data:PromptRequest):


    response = client.images.generate(

        model="gpt-image-1",

        prompt=data.prompt,

        size="1024x1024"

    )


    image_url = response.data[0].url



    return {

        "image":image_url

    }