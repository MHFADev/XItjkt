from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    nickname = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'nickname': self.nickname,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class Photo(db.Model):
    __tablename__ = 'photos'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    uploader_name = db.Column(db.String(100), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(50), default='general')
    likes_count = db.Column(db.Integer, default=0)
    
    # Relationships
    likes = db.relationship('Like', backref='photo', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='photo', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        from sqlalchemy import select, func
        comments_count = db.session.query(func.count(Comment.id)).filter(Comment.photo_id == self.id).scalar() or 0
        return {
            'id': self.id,
            'filename': self.filename,
            'title': self.title,
            'description': self.description,
            'uploader_name': self.uploader_name,
            'upload_date': self.upload_date.strftime('%Y-%m-%d %H:%M:%S') if self.upload_date else None,
            'category': self.category,
            'likes_count': self.likes_count,
            'comments_count': comments_count
        }

class Like(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.Integer, primary_key=True)
    photo_id = db.Column(db.Integer, db.ForeignKey('photos.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate likes
    __table_args__ = (db.UniqueConstraint('photo_id', 'user_name', name='unique_like'),)

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    photo_id = db.Column(db.Integer, db.ForeignKey('photos.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'photo_id': self.photo_id,
            'user_name': self.user_name,
            'comment_text': self.comment_text,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
