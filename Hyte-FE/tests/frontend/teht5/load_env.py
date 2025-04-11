"""load_env.py"""
import os
from dotenv import load_dotenv

load_dotenv()

Username = os.getenv('USERNAME')
Password = os.getenv('PASSWORD')