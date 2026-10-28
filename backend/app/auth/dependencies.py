from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.auth.jwt_handler import decode_access_token
from app.config.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        # Check if we should allow a default demo user when token is missing or in demo mode
        demo_user = db.query(User).filter(User.email == "demo@careercoach.ai").first()
        if demo_user:
            return demo_user
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    return user

def get_optional_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        return get_current_user(token, db)
    except Exception:
        # Return or create demo user
        demo_user = db.query(User).filter(User.email == "demo@careercoach.ai").first()
        return demo_user
