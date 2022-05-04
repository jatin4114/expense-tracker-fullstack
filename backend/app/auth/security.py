# security.py - password hashing + jwt token stuff

import os
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt

SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_change_me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def hash_password(password: str) -> str:
    # bcrypt works with bytes, and returns bytes back, so converting
    # to/from a normal string to store it in the db
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # "sub" (subject) is the standard jwt field for who the token belongs to
    to_encode = {"sub": str(user_id), "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    # returns the payload if valid, raises jose.JWTError if not
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
