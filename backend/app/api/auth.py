from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserOut, Token, UserUpdate
from app.auth.jwt_handler import get_password_hash, verify_password, create_access_token
from app.auth.dependencies import get_current_user
from datetime import timedelta
from app.config.settings import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Hash password securely
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        target_role=user_in.target_role or "Software Engineer Intern",
        preferred_language=user_in.preferred_language or "en"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is disabled.")

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/logout")
def logout():
    # Stateless JWT logout acknowledged by client clearing token
    return {"message": "Logged out successfully."}

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(updates: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if updates.full_name is not None:
        current_user.full_name = updates.full_name
    if updates.target_role is not None:
        current_user.target_role = updates.target_role
    if updates.preferred_language is not None:
        current_user.preferred_language = updates.preferred_language
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/delete-account", status_code=status.HTTP_200_OK)
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Privacy requirement: Enables users to completely erase all their resumes,
    interview sessions, messages, and account details.
    """
    db.delete(current_user)
    db.commit()
    return {"message": "Your account and all associated resumes and interview history have been permanently deleted."}
