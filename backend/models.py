from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# Таблица связи многие-ко-многим для участников сообществ
community_members = Table(
    'community_members',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('community_id', Integer, ForeignKey('communities.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True)  # короткое имя для поиска
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    avatar = Column(String, nullable=True)
    role = Column(String, default="user")  # user или company_representative
    location = Column(String, nullable=True)  # город, страна
    education = Column(String, nullable=True)  # место учебы/работы
    company = Column(String, nullable=True)  # название компании (для представителей)
    status = Column(String, nullable=True)  # специалист или представитель компании
    skills = Column(Text, nullable=True)  # JSON массив навыков
    reputation = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Отношения
    posts = relationship("Post", back_populates="author")
    communities_owned = relationship("Community", back_populates="owner")
    communities_joined = relationship("Community", secondary=community_members, back_populates="members")
    announcements = relationship("Announcement", back_populates="author")
    cases = relationship("Case", back_populates="author")
    likes = relationship("Like", back_populates="user")
    comments = relationship("Comment", back_populates="user")

class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # Направление: "Технологии и IT", "Дизайн и творчество" и т.д.
    image = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    members_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Отношения
    owner = relationship("User", back_populates="communities_owned")
    members = relationship("User", secondary=community_members, back_populates="communities_joined")
    posts = relationship("Post", back_populates="community")
    announcements = relationship("Announcement", back_populates="community")
    cases = relationship("Case", back_populates="community")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    image = Column(String, nullable=True)
    author_id = Column(Integer, ForeignKey('users.id'))
    community_id = Column(Integer, ForeignKey('communities.id'))  # Только сообщества могут создавать посты
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Отношения
    author = relationship("User", back_populates="posts")
    community = relationship("Community", back_populates="posts")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey('users.id'))
    community_id = Column(Integer, ForeignKey('communities.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Отношения
    author = relationship("User", back_populates="announcements")
    community = relationship("Community", back_populates="announcements")

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, default="medium")  # easy (легкий), medium (средний), hard (сложный)
    required_skills = Column(Text, nullable=True)  # JSON массив необходимых навыков
    deadline = Column(DateTime, nullable=True)  # дата сдачи кейса
    status = Column(String, default="open")  # open, in_progress, closed
    author_id = Column(Integer, ForeignKey('users.id'))
    community_id = Column(Integer, ForeignKey('communities.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Отношения
    author = relationship("User", back_populates="cases")
    community = relationship("Community", back_populates="cases")

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    post_id = Column(Integer, ForeignKey('posts.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Отношения
    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    post_id = Column(Integer, ForeignKey('posts.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Отношения
    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
