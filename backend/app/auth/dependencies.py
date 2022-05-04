# dependencies.py - fastapi dependency that figures out who is making
# the request, based on the JWT in the Authorization header

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.auth.security import decode_access_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_error
    except JWTError:
        raise credentials_error

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_error

    return user
