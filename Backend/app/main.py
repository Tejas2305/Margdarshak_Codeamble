from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return("my backend trail using fastapi is working") 