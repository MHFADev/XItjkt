from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class Student(UserMixin, db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    nisn = db.Column(db.String(10), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    nickname = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    photos = db.relationship('Photo', backref='student', lazy=True)
    likes = db.relationship('Like', backref='student', lazy=True)
    comments = db.relationship('Comment', backref='student', lazy=True)
    
    def get_id(self):
        return str(self.id)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nisn': self.nisn,
            'name': self.name,
            'nickname': self.nickname,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class Photo(db.Model):
    __tablename__ = 'photos'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    cloudinary_url = db.Column(db.String(500), nullable=False)
    cloudinary_public_id = db.Column(db.String(255))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(50), default='general')
    likes_count = db.Column(db.Integer, default=0)
    
    # Relationships
    photo_likes = db.relationship('Like', backref='photo', lazy=True, cascade='all, delete-orphan')
    photo_comments = db.relationship('Comment', backref='photo', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        from sqlalchemy import select, func
        comments_count = db.session.query(func.count(Comment.id)).filter(Comment.photo_id == self.id).scalar() or 0
        return {
            'id': self.id,
            'student_id': self.student_id,
            'uploader_name': self.student.nickname if self.student else 'Unknown',
            'cloudinary_url': self.cloudinary_url,
            'title': self.title,
            'description': self.description,
            'upload_date': self.upload_date.strftime('%Y-%m-%d %H:%M:%S') if self.upload_date else None,
            'category': self.category,
            'likes_count': self.likes_count,
            'comments_count': comments_count
        }

class Like(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.Integer, primary_key=True)
    photo_id = db.Column(db.Integer, db.ForeignKey('photos.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate likes
    __table_args__ = (db.UniqueConstraint('photo_id', 'student_id', name='unique_like'),)

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    photo_id = db.Column(db.Integer, db.ForeignKey('photos.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'photo_id': self.photo_id,
            'student_id': self.student_id,
            'user_name': self.student.nickname if self.student else 'Unknown',
            'comment_text': self.comment_text,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
