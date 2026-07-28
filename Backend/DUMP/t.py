from fastapi import FastAPI
app = FastAPI(
    title="Margadarshak API",
    description="Backend API for the Margadarshak project",
    docs_url="/docs", 
)
@app.get("/hello" , tags=["Trail"], summary="Returns a welcome message")
def say_hello():
    return {"message": "Hello, welcome to FastAPI!"}