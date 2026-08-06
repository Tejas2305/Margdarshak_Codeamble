from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST= os.getenv("DB_HOST")
DB_PORT=os.getenv("DB_PORT")
DB_NAME=os.getenv("DB_NAME")
DB_USER=os.getenv("DB_USER")
DB_PASSWORD=os.getenv("DB_PASSWORD")

DATABASE_URL = (
    f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

print(DATABASE_URL)
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")    
ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")) 

REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 30)
)

OSRM_UPDATE_DEBOUNCE_SECONDS = float(os.getenv("OSRM_UPDATE_DEBOUNCE_SECONDS", "30"))
OSRM_FILE_PATH = os.getenv("OSRM_FILE_PATH", "/data/pune.osrm")
OSRM_SPEED_CSV_PATH = os.getenv("OSRM_SPEED_CSV_PATH", "/data/pune.speeds.csv")
ENABLE_OSRM_SUBPROCESS_CUSTOMIZE = os.getenv("ENABLE_OSRM_SUBPROCESS_CUSTOMIZE", "false").lower() in ("true", "1", "yes")