# main.py starts the backend; it's the entry point for FastAPI

from fastapi import FastAPI
from .database import Base, engine
from . import models  # register models before create_all
from .routers import dispensers, measurements

# creates any missing database tables 
Base.metadata.create_all(bind=engine) 

# FastAPI creates the  web application
app = FastAPI(title='Menstrual Product Tracker')

app.include_router(dispensers.router) 
app.include_router(measurements.router) 

@app.get('/health') # way to check if the server is responding
def health():
    return {'status': 'ok'}
