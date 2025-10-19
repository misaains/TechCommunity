from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import func
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict
import json

import models
from database import engine, get_db

# Создание таблиц
models.Base.metadata.create_all(bind=engine)

# Конфигурация
SECRET_KEY = "your-secret-key-change-in-production-2024-techcommunity"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 дней

# Хеширование паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# FastAPI приложение
app = FastAPI(title="TechCommunity API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# PYDANTIC СХЕМЫ
# =============================================================================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    username: Optional[str] = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: str
    name: str
    username: Optional[str] = None
    bio: Optional[str] = None
    role: Optional[str] = "user"
    location: Optional[str] = None
    education: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    avatar: Optional[str] = None
    skills: Optional[str] = None
    reputation: int = 0
    created_at: datetime
    communities_count: Optional[int] = 0
    cases_count: Optional[int] = 0

class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    skills: Optional[str] = None
    avatar: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserResponse] = None

class CommunityCreate(BaseModel):
    name: str
    description: str
    category: Optional[str] = None
    image: Optional[str] = None

class CommunityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    description: Optional[str]
    category: Optional[str]
    image: Optional[str]
    owner_id: int
    members_count: int = 0
    created_at: datetime
    is_subscribed: Optional[bool] = False

class AnnouncementCreate(BaseModel):
    title: str
    content: str

class AnnouncementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    content: str
    author_id: int
    community_id: int
    created_at: datetime

class CaseCreate(BaseModel):
    title: str
    description: str
    difficulty: Optional[str] = "medium"
    required_skills: Optional[List[str]] = []
    deadline: Optional[datetime] = None

class CaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: str
    difficulty: str
    required_skills: Optional[str] = None
    deadline: Optional[datetime] = None
    status: str
    author_id: int
    community_id: int
    created_at: datetime

class PostCreate(BaseModel):
    content: str
    image: Optional[str] = None
    community_id: int

class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    content: str
    image: Optional[str]
    author_id: int
    community_id: int
    community_name: Optional[str] = None
    community_image: Optional[str] = None
    community_category: Optional[str] = None
    likes_count: int = 0
    comments_count: int = 0
    is_liked: Optional[bool] = False
    created_at: datetime

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    content: str
    user_id: int
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    post_id: int
    created_at: datetime

# =============================================================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# =============================================================================

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# =============================================================================
# МАРШРУТЫ АУТЕНТИФИКАЦИИ
# =============================================================================

@app.post("/api/signup", response_model=Token)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Проверка существует ли пользователь
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Генерация username если не указан
    username = user.username
    if not username:
        # Создаем username из email
        username = user.email.split('@')[0]
        # Проверяем уникальность
        base_username = username
        counter = 1
        while db.query(models.User).filter(models.User.username == username).first():
            username = f"{base_username}{counter}"
            counter += 1
    
    # Создание нового пользователя
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        name=user.name,
        username=username,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Создание токена
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    
    # Подсчет статистики
    communities_count = len(new_user.communities_joined)
    cases_count = db.query(models.Case).filter(models.Case.author_id == new_user.id).count()
    
    user_response = UserResponse(
        id=new_user.id,
        email=new_user.email,
        name=new_user.name,
        username=new_user.username,
        bio=new_user.bio,
        role=new_user.role,
        location=new_user.location,
        education=new_user.education,
        company=new_user.company,
        status=new_user.status,
        avatar=new_user.avatar,
        skills=new_user.skills,
        reputation=new_user.reputation,
        created_at=new_user.created_at,
        communities_count=communities_count,
        cases_count=cases_count
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_response}

@app.post("/api/login", response_model=Token)
async def login(
    username: str = Form(...),  # Фронтенд отправляет email как username
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Ищем пользователя по email (username в форме)
    user = db.query(models.User).filter(models.User.email == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Создание токена
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Подсчет статистики
    communities_count = len(user.communities_joined)
    cases_count = db.query(models.Case).filter(models.Case.author_id == user.id).count()
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        username=user.username,
        bio=user.bio,
        role=user.role,
        location=user.location,
        education=user.education,
        company=user.company,
        status=user.status,
        avatar=user.avatar,
        skills=user.skills,
        reputation=user.reputation,
        created_at=user.created_at,
        communities_count=communities_count,
        cases_count=cases_count
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_response}

# =============================================================================
# МАРШРУТЫ ПОЛЬЗОВАТЕЛЕЙ
# =============================================================================

@app.get("/api/users/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    communities_count = len(current_user.communities_joined)
    cases_count = db.query(models.Case).filter(models.Case.author_id == current_user.id).count()
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        username=current_user.username,
        bio=current_user.bio,
        role=current_user.role,
        location=current_user.location,
        education=current_user.education,
        company=current_user.company,
        status=current_user.status,
        avatar=current_user.avatar,
        skills=current_user.skills,
        reputation=current_user.reputation,
        created_at=current_user.created_at,
        communities_count=communities_count,
        cases_count=cases_count
    )

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    communities_count = len(user.communities_joined)
    cases_count = db.query(models.Case).filter(models.Case.author_id == user.id).count()
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        username=user.username,
        bio=user.bio,
        role=user.role,
        location=user.location,
        education=user.education,
        company=user.company,
        status=user.status,
        avatar=user.avatar,
        skills=user.skills,
        reputation=user.reputation,
        created_at=user.created_at,
        communities_count=communities_count,
        cases_count=cases_count
    )

@app.put("/api/users/me", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.username is not None:
        # Проверка уникальности username
        existing = db.query(models.User).filter(
            models.User.username == user_update.username,
            models.User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_update.username
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.location is not None:
        current_user.location = user_update.location
    if user_update.education is not None:
        current_user.education = user_update.education
    if user_update.company is not None:
        current_user.company = user_update.company
    if user_update.status is not None:
        current_user.status = user_update.status
    if user_update.skills is not None:
        current_user.skills = user_update.skills
    if user_update.avatar is not None:
        current_user.avatar = user_update.avatar
    
    db.commit()
    db.refresh(current_user)
    
    communities_count = len(current_user.communities_joined)
    cases_count = db.query(models.Case).filter(models.Case.author_id == current_user.id).count()
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        username=current_user.username,
        bio=current_user.bio,
        role=current_user.role,
        location=current_user.location,
        education=current_user.education,
        company=current_user.company,
        status=current_user.status,
        avatar=current_user.avatar,
        skills=current_user.skills,
        reputation=current_user.reputation,
        created_at=current_user.created_at,
        communities_count=communities_count,
        cases_count=cases_count
    )

# =============================================================================
# МАРШРУТЫ СООБЩЕСТВ
# =============================================================================

@app.get("/api/communities", response_model=List[CommunityResponse])
async def get_communities(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Community)
    
    if category and category != "Все":
        query = query.filter(models.Community.category == category)
    
    if search:
        query = query.filter(models.Community.name.ilike(f"%{search}%"))
    
    communities = query.offset(skip).limit(limit).all()
    
    result = []
    for community in communities:
        is_subscribed = current_user in community.members if current_user else False
        result.append(CommunityResponse(
            id=community.id,
            name=community.name,
            description=community.description,
            category=community.category,
            image=community.image,
            owner_id=community.owner_id,
            members_count=len(community.members),
            created_at=community.created_at,
            is_subscribed=is_subscribed
        ))
    
    return result

@app.get("/api/communities/{community_id}", response_model=CommunityResponse)
async def get_community(
    community_id: int,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    community = db.query(models.Community).filter(models.Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    is_subscribed = current_user in community.members if current_user else False
    
    return CommunityResponse(
        id=community.id,
        name=community.name,
        description=community.description,
        category=community.category,
        image=community.image,
        owner_id=community.owner_id,
        members_count=len(community.members),
        created_at=community.created_at,
        is_subscribed=is_subscribed
    )

@app.post("/api/communities", response_model=CommunityResponse)
async def create_community(
    community: CommunityCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_community = models.Community(
        name=community.name,
        description=community.description,
        category=community.category,
        image=community.image,
        owner_id=current_user.id,
        members_count=1
    )
    db.add(new_community)
    db.commit()
    db.refresh(new_community)
    
    # Автоматически добавляем создателя в участники
    new_community.members.append(current_user)
    db.commit()
    
    return CommunityResponse(
        id=new_community.id,
        name=new_community.name,
        description=new_community.description,
        category=new_community.category,
        image=new_community.image,
        owner_id=new_community.owner_id,
        members_count=1,
        created_at=new_community.created_at,
        is_subscribed=True
    )

@app.post("/api/communities/{community_id}/subscribe")
async def subscribe_community(
    community_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    community = db.query(models.Community).filter(models.Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    # Проверяем, не состоит ли пользователь уже в сообществе
    if current_user in community.members:
        raise HTTPException(status_code=400, detail="Already subscribed")
    
    community.members.append(current_user)
    community.members_count = len(community.members)
    db.commit()
    
    return {"message": "Successfully subscribed", "is_subscribed": True}

@app.post("/api/communities/{community_id}/unsubscribe")
async def unsubscribe_community(
    community_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    community = db.query(models.Community).filter(models.Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    if current_user not in community.members:
        raise HTTPException(status_code=400, detail="Not subscribed")
    
    community.members.remove(current_user)
    community.members_count = len(community.members)
    db.commit()
    
    return {"message": "Successfully unsubscribed", "is_subscribed": False}

@app.get("/api/communities/{community_id}/members", response_model=List[UserResponse])
async def get_community_members(
    community_id: int,
    db: Session = Depends(get_db)
):
    community = db.query(models.Community).filter(models.Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    return [UserResponse(
        id=member.id,
        email=member.email,
        name=member.name,
        username=member.username,
        bio=member.bio,
        role=member.role,
        location=member.location,
        education=member.education,
        company=member.company,
        status=member.status,
        avatar=member.avatar,
        skills=member.skills,
        reputation=member.reputation,
        created_at=member.created_at,
        communities_count=len(member.communities_joined),
        cases_count=0
    ) for member in community.members]

# =============================================================================
# МАРШРУТЫ ПОСТОВ
# =============================================================================

@app.get("/api/feed", response_model=List[PostResponse])
async def get_feed(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Лента постов из сообществ, на которые подписан пользователь"""
    # Получаем ID сообществ, на которые подписан пользователь
    subscribed_community_ids = [c.id for c in current_user.communities_joined]
    
    # Получаем посты из этих сообществ
    posts = db.query(models.Post).filter(
        models.Post.community_id.in_(subscribed_community_ids)
    ).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for post in posts:
        # Проверяем, лайкнул ли пользователь этот пост
        is_liked = db.query(models.Like).filter(
            models.Like.user_id == current_user.id,
            models.Like.post_id == post.id
        ).first() is not None
        
        result.append(PostResponse(
            id=post.id,
            content=post.content,
            image=post.image,
            author_id=post.author_id,
            community_id=post.community_id,
            community_name=post.community.name if post.community else None,
            community_image=post.community.image if post.community else None,
            community_category=post.community.category if post.community else None,
            likes_count=post.likes_count,
            comments_count=post.comments_count,
            is_liked=is_liked,
            created_at=post.created_at
        ))
    
    return result

@app.get("/api/communities/{community_id}/posts", response_model=List[PostResponse])
async def get_community_posts(
    community_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Все посты сообщества"""
    posts = db.query(models.Post).filter(
        models.Post.community_id == community_id
    ).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for post in posts:
        is_liked = False
        if current_user:
            is_liked = db.query(models.Like).filter(
                models.Like.user_id == current_user.id,
                models.Like.post_id == post.id
            ).first() is not None
        
        result.append(PostResponse(
            id=post.id,
            content=post.content,
            image=post.image,
            author_id=post.author_id,
            community_id=post.community_id,
            community_name=post.community.name if post.community else None,
            community_image=post.community.image if post.community else None,
            community_category=post.community.category if post.community else None,
            likes_count=post.likes_count,
            comments_count=post.comments_count,
            is_liked=is_liked,
            created_at=post.created_at
        ))
    
    return result

@app.post("/api/posts", response_model=PostResponse)
async def create_post(
    post: PostCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создать пост в сообществе (только для представителей компании)"""
    # Проверяем, что пользователь - представитель компании или владелец сообщества
    community = db.query(models.Community).filter(models.Community.id == post.community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    if community.owner_id != current_user.id and current_user.role != "company_representative":
        raise HTTPException(status_code=403, detail="Only community owners or company representatives can create posts")
    
    new_post = models.Post(
        content=post.content,
        image=post.image,
        author_id=current_user.id,
        community_id=post.community_id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return PostResponse(
        id=new_post.id,
        content=new_post.content,
        image=new_post.image,
        author_id=new_post.author_id,
        community_id=new_post.community_id,
        community_name=community.name,
        community_image=community.image,
        community_category=community.category,
        likes_count=0,
        comments_count=0,
        is_liked=False,
        created_at=new_post.created_at
    )

@app.post("/api/posts/{post_id}/like")
async def like_post(
    post_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Лайкнуть пост"""
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Проверяем, не лайкнул ли уже
    existing_like = db.query(models.Like).filter(
        models.Like.user_id == current_user.id,
        models.Like.post_id == post_id
    ).first()
    
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked")
    
    new_like = models.Like(user_id=current_user.id, post_id=post_id)
    db.add(new_like)
    post.likes_count += 1
    db.commit()
    
    return {"message": "Post liked", "likes_count": post.likes_count}

@app.delete("/api/posts/{post_id}/like")
async def unlike_post(
    post_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Убрать лайк"""
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    like = db.query(models.Like).filter(
        models.Like.user_id == current_user.id,
        models.Like.post_id == post_id
    ).first()
    
    if not like:
        raise HTTPException(status_code=400, detail="Not liked")
    
    db.delete(like)
    post.likes_count = max(0, post.likes_count - 1)
    db.commit()
    
    return {"message": "Like removed", "likes_count": post.likes_count}

# =============================================================================
# МАРШРУТЫ КОММЕНТАРИЕВ
# =============================================================================

@app.get("/api/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получить комментарии поста"""
    comments = db.query(models.Comment).filter(
        models.Comment.post_id == post_id
    ).order_by(models.Comment.created_at.desc()).offset(skip).limit(limit).all()
    
    return [CommentResponse(
        id=comment.id,
        content=comment.content,
        user_id=comment.user_id,
        user_name=comment.user.name if comment.user else None,
        user_avatar=comment.user.avatar if comment.user else None,
        post_id=comment.post_id,
        created_at=comment.created_at
    ) for comment in comments]

@app.post("/api/posts/{post_id}/comments", response_model=CommentResponse)
async def create_comment(
    post_id: int,
    comment: CommentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создать комментарий"""
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = models.Comment(
        content=comment.content,
        user_id=current_user.id,
        post_id=post_id
    )
    db.add(new_comment)
    post.comments_count += 1
    db.commit()
    db.refresh(new_comment)
    
    return CommentResponse(
        id=new_comment.id,
        content=new_comment.content,
        user_id=new_comment.user_id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        post_id=new_comment.post_id,
        created_at=new_comment.created_at
    )

# =============================================================================
# МАРШРУТЫ КЕЙСОВ
# =============================================================================

@app.get("/api/communities/{community_id}/cases", response_model=List[CaseResponse])
async def get_cases(
    community_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    cases = db.query(models.Case).filter(
        models.Case.community_id == community_id,
        models.Case.status == "open"
    ).order_by(models.Case.created_at.desc()).offset(skip).limit(limit).all()
    
    return cases

@app.post("/api/communities/{community_id}/cases", response_model=CaseResponse)
async def create_case(
    community_id: int,
    case: CaseCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Проверяем существование сообщества
    community = db.query(models.Community).filter(models.Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    # Преобразуем список навыков в JSON
    required_skills_json = json.dumps(case.required_skills) if case.required_skills else None
    
    # Создаем кейс
    new_case = models.Case(
        title=case.title,
        description=case.description,
        difficulty=case.difficulty,
        required_skills=required_skills_json,
        deadline=case.deadline,
        author_id=current_user.id,
        community_id=community_id
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    
    return new_case

# =============================================================================
# МАРШРУТЫ ОБЪЯВЛЕНИЙ
# =============================================================================

@app.get("/api/communities/{community_id}/announcements", response_model=List[AnnouncementResponse])
async def get_announcements(
    community_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    announcements = db.query(models.Announcement).filter(
        models.Announcement.community_id == community_id
    ).order_by(models.Announcement.created_at.desc()).offset(skip).limit(limit).all()
    
    return announcements

@app.post("/api/communities/{community_id}/announcements", response_model=AnnouncementResponse)
async def create_announcement(
    community_id: int,
    announcement: AnnouncementCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Проверяем существование сообщества
    community = db.query(models.Community).filter(models.Community.id == community_id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    # Создаем объявление
    new_announcement = models.Announcement(
        title=announcement.title,
        content=announcement.content,
        author_id=current_user.id,
        community_id=community_id
    )
    db.add(new_announcement)
    db.commit()
    db.refresh(new_announcement)
    
    return new_announcement

# =============================================================================
# БАЗОВЫЕ МАРШРУТЫ
# =============================================================================

@app.get("/")
async def root():
    return {"message": "TechCommunity API", "version": "2.0.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Запуск сервера
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
