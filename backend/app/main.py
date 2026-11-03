# main.py starts the backend; it's the entry point for FastAPI

from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse

from .database import Base, engine
from . import models  # register models before create_all
from .routers import dispensers, measurements

# creates any missing database tables 
Base.metadata.create_all(bind=engine) 

# FastAPI creates the  web application
app = FastAPI(title='Menstrual Product Tracker')

app.include_router(dispensers.router) 
app.include_router(measurements.router) 

# Absolute path to backend/static/index.html
HTML_PATH = Path(__file__).resolve().parent.parent / "static" / "index.html"

@app.get("/")
def home():
    return FileResponse(HTML_PATH)

@app.get('/health') # way to check if the server is responding
def health():
    return {'status': 'ok'}
