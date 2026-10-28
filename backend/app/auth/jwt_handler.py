import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from app.config.settings import settings
import hashlib
import hmac

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Fallback verification in case of hash scheme variations
        salt = hashed_password[:16] if len(hashed_password) > 16 else "careercoach"
        computed = hashlib.sha256((salt + plain_password).encode()).hexdigest()
        return hmac.compare_digest(computed, hashed_password[16:])

def get_password_hash(password: str) -> str:
    try:
        return pwd_context.hash(password)
    except Exception:
        salt = "c4r33rc04ch_s4lt"
        computed = hashlib.sha256((salt + password).encode()).hexdigest()
        return salt + computed

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
