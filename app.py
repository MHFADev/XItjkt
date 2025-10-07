
import os
import cloudinary
import cloudinary.uploader
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
import logging
from models import db, Student, Photo, Like, Comment
from werkzeug.utils import secure_filename
from datetime import datetime

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

if not app.secret_key:
    raise RuntimeError("SESSION_SECRET environment variable must be set!")

database_url = os.environ.get("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Silakan login terlebih dahulu'

@login_manager.user_loader
def load_user(user_id):
    return Student.query.get(int(user_id))

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

CLASS_DATA = {
    'name': 'XI TJKT 1',
    'full_name': 'Kelas XI Teknik Jaringan Komputer dan Telekomunikasi 1',
    'year': '2024/2025',
    'total_students': 31,
    'motto': 'Connect, Collaborate, Create',
    'description': 'Kelas yang penuh semangat dalam menguasai teknologi jaringan komputer dan telekomunikasi!'
}

HOMEROOM_TEACHER = {
    'name': 'Bapak/Ibu Wali Kelas',
    'subject': 'Teknik Jaringan Komputer',
    'email': 'walikelas@example.com',
    'quote': 'Belajar dengan tekun, berkarya dengan ikhlas',
    'description': 'Guru yang berdedikasi tinggi dalam membimbing siswa-siswi XI TJKT 1'
}

CLASS_STRUCTURE = {
    'core': {
        'position': 'Wali Kelas',
        'name': HOMEROOM_TEACHER['name'],
        'type': 'teacher',
        'icon': 'graduation-cap'
    },
    'officers': [
        {
            'position': 'Ketua Kelas',
            'name': 'Nama Ketua',
            'type': 'leader',
            'icon': 'star',
            'color': 'purple'
        },
        {
            'position': 'Wakil Ketua',
            'name': 'Nama Wakil',
            'type': 'leader',
            'icon': 'shield',
            'color': 'blue'
        },
        {
            'position': 'Sekretaris',
            'name': 'Nama Sekretaris',
            'type': 'admin',
            'icon': 'book',
            'color': 'green'
        },
        {
            'position': 'Bendahara',
            'name': 'Nama Bendahara',
            'type': 'admin',
            'icon': 'wallet',
            'color': 'yellow'
        }
    ],
    'divisions': [
        {
            'name': 'Divisi Keamanan',
            'members': ['Anggota 1', 'Anggota 2'],
            'icon': 'lock',
            'color': 'red'
        },
        {
            'name': 'Divisi Kebersihan',
            'members': ['Anggota 3', 'Anggota 4'],
            'icon': 'broom',
            'color': 'cyan'
        },
        {
            'name': 'Divisi Acara',
            'members': ['Anggota 5', 'Anggota 6'],
            'icon': 'calendar',
            'color': 'pink'
        },
        {
            'name': 'Divisi Dokumentasi',
            'members': ['Anggota 7', 'Anggota 8'],
            'icon': 'camera',
            'color': 'indigo'
        }
    ]
}

ALBUMS = {
    'kegiatan': {
        'title': 'Album Kegiatan Kelas',
        'description': 'Dokumentasi berbagai kegiatan seru dan pembelajaran kelas XI TJKT 1',
        'category': 'kegiatan'
    },
    'praktikum': {
        'title': 'Album Praktikum TJKT',
        'description': 'Dokumentasi praktikum teknik jaringan dan konfigurasi perangkat',
        'category': 'praktikum'
    },
    'acara': {
        'title': 'Album Acara & Event',
        'description': 'Berbagai acara dan event yang diikuti kelas XI TJKT 1',
        'category': 'acara'
    }
}

@app.route('/')
def index():
    return render_template('index.html',
                         class_data=CLASS_DATA,
                         teacher=HOMEROOM_TEACHER,
                         structure=CLASS_STRUCTURE,
                         albums=ALBUMS)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        nisn = request.form.get('nisn')
        student = Student.query.filter_by(nisn=nisn).first()
        
        if student:
            login_user(student)
            flash(f'Selamat datang, {student.nickname}!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('index'))
        else:
            flash('NISN tidak ditemukan!', 'error')
    
    return render_template('login.html', class_data=CLASS_DATA)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Anda telah logout', 'info')
    return redirect(url_for('index'))

@app.route('/album/<album_type>')
def album(album_type):
    if album_type not in ALBUMS:
        return redirect(url_for('index'))
    
    photos = Photo.query.filter_by(category=album_type).order_by(Photo.upload_date.desc()).all()
    all_students = Student.query.all()
    
    album_data = ALBUMS[album_type].copy()
    
    return render_template('album.html',
                         album_type=album_type,
                         data=album_data,
                         photos=photos,
                         students=all_students,
                         class_data=CLASS_DATA)

@app.route('/contact', methods=['POST'])
def contact():
    try:
        name = request.form.get('name') or request.json.get('name')
        email = request.form.get('email') or request.json.get('email')
        message = request.form.get('message') or request.json.get('message')
        
        if not all([name, email, message]):
            return jsonify({
                'status': 'error',
                'message': 'Semua field harus diisi!'
            }), 400
        
        app.logger.info(f"Contact form submission: {name} ({email})")
        
        return jsonify({
            'status': 'success',
            'message': '🎉 Pesan berhasil dikirim! Terima kasih.'
        })
            
    except Exception as e:
        app.logger.error(f"Contact form error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Terjadi kesalahan. Silakan coba lagi.'
        }), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/students')
def students():
    all_students = Student.query.order_by(Student.id).all()
    return render_template('students.html', 
                         students=all_students,
                         class_data=CLASS_DATA)

@app.route('/gallery')
def gallery():
    category = request.args.get('category', 'all')
    
    if category == 'all':
        photos = Photo.query.order_by(Photo.upload_date.desc()).all()
    else:
        photos = Photo.query.filter_by(category=category).order_by(Photo.upload_date.desc()).all()
    
    all_students = Student.query.all()
    return render_template('gallery.html',
                         photos=photos,
                         students=all_students,
                         class_data=CLASS_DATA,
                         current_category=category)

@app.route('/upload', methods=['POST'])
@login_required
def upload_photo():
    try:
        if 'photo' not in request.files:
            return jsonify({'status': 'error', 'message': 'Tidak ada file yang dipilih!'}), 400
        
        file = request.files['photo']
        title = request.form.get('title', '')
        description = request.form.get('description', '')
        category = request.form.get('category', 'general')
        
        if not file or file.filename == '' or file.filename is None:
            return jsonify({'status': 'error', 'message': 'Tidak ada file yang dipilih!'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'status': 'error', 'message': 'Format file tidak didukung! Gunakan PNG, JPG, JPEG, atau GIF'}), 400
        
        cloudinary_cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
        cloudinary_api_key = os.environ.get('CLOUDINARY_API_KEY')
        cloudinary_api_secret = os.environ.get('CLOUDINARY_API_SECRET')
        
        if not all([cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret]):
            return jsonify({'status': 'error', 'message': 'Cloudinary belum dikonfigurasi!'}), 500
        
        cloudinary.config(
            cloud_name=cloudinary_cloud_name,
            api_key=cloudinary_api_key,
            api_secret=cloudinary_api_secret
        )
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        public_id = f"tjkt1/{category}/{current_user.nisn}_{timestamp}"
        
        upload_result = cloudinary.uploader.upload(
            file,
            public_id=public_id,
            folder="tjkt1_photos"
        )
        
        photo = Photo(
            student_id=current_user.id,
            cloudinary_url=upload_result['secure_url'],
            cloudinary_public_id=upload_result['public_id'],
            title=title or file.filename,
            description=description or '',
            category=category
        )
        db.session.add(photo)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': '🎉 Foto berhasil diupload!',
            'photo': photo.to_dict()
        })
    
    except Exception as e:
        app.logger.error(f"Upload error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': f'Terjadi kesalahan: {str(e)}'
        }), 500

@app.route('/like/<int:photo_id>', methods=['POST'])
@login_required
def like_photo(photo_id):
    try:
        photo = Photo.query.get_or_404(photo_id)
        
        existing_like = Like.query.filter_by(photo_id=photo_id, student_id=current_user.id).first()
        
        if existing_like:
            db.session.delete(existing_like)
            photo.likes_count = max(0, photo.likes_count - 1)
            db.session.commit()
            return jsonify({
                'status': 'success',
                'action': 'unliked',
                'likes_count': photo.likes_count
            })
        else:
            like = Like(photo_id=photo_id, student_id=current_user.id)
            db.session.add(like)
            photo.likes_count += 1
            db.session.commit()
            return jsonify({
                'status': 'success',
                'action': 'liked',
                'likes_count': photo.likes_count
            })
    
    except Exception as e:
        app.logger.error(f"Like error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Terjadi kesalahan'
        }), 500

@app.route('/comment/<int:photo_id>', methods=['POST'])
@login_required
def add_comment(photo_id):
    try:
        comment_text = request.json.get('comment', '')
        
        if not comment_text:
            return jsonify({'status': 'error', 'message': 'Komentar tidak boleh kosong!'}), 400
        
        photo = Photo.query.get_or_404(photo_id)
        
        comment = Comment(
            photo_id=photo_id,
            student_id=current_user.id,
            comment_text=comment_text
        )
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Komentar berhasil ditambahkan!',
            'comment': comment.to_dict()
        })
    
    except Exception as e:
        app.logger.error(f"Comment error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Terjadi kesalahan'
        }), 500

@app.route('/comments/<int:photo_id>')
def get_comments(photo_id):
    photo = Photo.query.get_or_404(photo_id)
    comments = Comment.query.filter_by(photo_id=photo_id).order_by(Comment.created_at.desc()).all()
    return jsonify({
        'comments': [c.to_dict() for c in comments]
    })

@app.route('/check_like/<int:photo_id>')
@login_required
def check_like(photo_id):
    existing_like = Like.query.filter_by(photo_id=photo_id, student_id=current_user.id).first()
    return jsonify({
        'liked': existing_like is not None
    })

@app.route('/init-db')
def init_database():
    try:
        db.create_all()
        return jsonify({
            'status': 'success',
            'message': 'Database tables created successfully!'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/import-siswa')
def import_siswa():
    try:
        import json
        
        with open('siswa.json', 'r') as f:
            data_siswa = json.load(f)
        
        try:
            Student.query.delete()
            db.session.commit()
        except:
            db.create_all()
        
        imported = 0
        skipped = 0
        nisn_used = set()
        
        for idx, siswa in enumerate(data_siswa, start=1):
            nisn = siswa.get('nisn')
            nama = siswa.get('nama')
            nickname = siswa.get('nickname')
            
            if not nisn or nisn in nisn_used:
                nisn = f"9{idx:09d}"
                skipped += 1
            
            nisn_used.add(str(nisn))
            
            student = Student(
                id=idx,
                nisn=str(nisn),
                name=nama,
                nickname=nickname
            )
            db.session.add(student)
            imported += 1
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': f'Berhasil import {imported} siswa ke database Railway!',
            'imported': imported,
            'auto_generated_nisn': skipped
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def init_db():
    with app.app_context():
        db.create_all()
        print("✅ Database tables created!")

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
