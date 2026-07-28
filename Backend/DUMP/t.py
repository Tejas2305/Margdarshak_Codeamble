from fastapi import FastAPI
app = FastAPI(
    docs_url="/docs", 
)
@app.get("/hello")
def say_hello():
    return {"message": "Hello, welcome to FastAPI!"}