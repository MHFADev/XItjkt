
import os
from flask import Flask, render_template, request, jsonify, redirect, url_for
import logging
from models import db, Student, Photo, Like, Comment
from werkzeug.utils import secure_filename
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

if not app.secret_key:
    raise RuntimeError("SESSION_SECRET environment variable must be set!")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# File upload configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize database
db.init_app(app)

# Data Kelas XI TJKT 1
CLASS_DATA = {
    'name': 'XI TJKT 1',
    'full_name': 'Kelas XI Teknik Jaringan Komputer dan Telekomunikasi 1',
    'year': '2024/2025',
    'total_students': 31,
    'motto': 'Connect, Collaborate, Create',
    'description': 'Kelas yang penuh semangat dalam menguasai teknologi jaringan komputer dan telekomunikasi!'
}

# Data Wali Kelas
HOMEROOM_TEACHER = {
    'name': 'Bapak/Ibu Wali Kelas',
    'subject': 'Teknik Jaringan Komputer',
    'email': 'walikelas@example.com',
    'quote': 'Belajar dengan tekun, berkarya dengan ikhlas',
    'description': 'Guru yang berdedikasi tinggi dalam membimbing siswa-siswi XI TJKT 1'
}

# Struktur Kelas (seperti topologi jaringan)
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

# Album Kelas
ALBUMS = {
    'kegiatan': {
        'title': 'Album Kegiatan Kelas',
        'description': 'Dokumentasi berbagai kegiatan seru dan pembelajaran kelas XI TJKT 1',
        'category': 'activities',
        'images': [
            {
                'url': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
                'title': 'Belajar Bersama',
                'description': 'Suasana belajar yang menyenangkan di kelas',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
                'title': 'Diskusi Kelompok',
                'description': 'Diskusi project jaringan komputer',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
                'title': 'Praktikum Lab',
                'description': 'Praktikum konfigurasi jaringan di laboratorium',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
                'title': 'Team Building',
                'description': 'Kegiatan team building kelas',
                'date': '2024'
            }
        ]
    },
    'praktikum': {
        'title': 'Album Praktikum TJKT',
        'description': 'Dokumentasi praktikum teknik jaringan dan konfigurasi perangkat',
        'category': 'practicum',
        'images': [
            {
                'url': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
                'title': 'Konfigurasi Router',
                'description': 'Praktik konfigurasi router Cisco',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
                'title': 'Crimping Kabel',
                'description': 'Praktik crimping kabel UTP',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
                'title': 'Server Management',
                'description': 'Maintenance dan monitoring server',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800',
                'title': 'Network Troubleshooting',
                'description': 'Troubleshooting masalah jaringan',
                'date': '2024'
            }
        ]
    },
    'acara': {
        'title': 'Album Acara & Event',
        'description': 'Berbagai acara dan event yang diikuti kelas XI TJKT 1',
        'category': 'events',
        'images': [
            {
                'url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
                'title': 'Class Gathering',
                'description': 'Acara kumpul-kumpul kelas',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                'title': 'Kompetisi IT',
                'description': 'Mengikuti kompetisi IT antar sekolah',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                'title': 'Study Tour',
                'description': 'Kunjungan ke perusahaan teknologi',
                'date': '2024'
            },
            {
                'url': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
                'title': 'Workshop',
                'description': 'Workshop teknologi terbaru',
                'date': '2024'
            }
        ]
    }
}

@app.route('/')
def index():
    """Main class portfolio page"""
    return render_template('index.html',
                         class_data=CLASS_DATA,
                         teacher=HOMEROOM_TEACHER,
                         structure=CLASS_STRUCTURE,
                         albums=ALBUMS)

@app.route('/album/<album_type>')
def album(album_type):
    """Album pages for different categories"""
    if album_type not in ALBUMS:
        return render_template('index.html',
                             class_data=CLASS_DATA,
                             teacher=HOMEROOM_TEACHER,
                             structure=CLASS_STRUCTURE,
                             albums=ALBUMS)
    
    return render_template('album.html',
                         album_type=album_type,
                         data=ALBUMS[album_type],
                         class_data=CLASS_DATA)

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
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

# Helper function for file upload
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes untuk Students
@app.route('/students')
def students():
    """Display all students"""
    all_students = Student.query.order_by(Student.id).all()
    return render_template('students.html', 
                         students=all_students,
                         class_data=CLASS_DATA)

# Routes untuk Gallery dengan Upload
@app.route('/gallery')
def gallery():
    """Display photo gallery"""
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
def upload_photo():
    """Handle photo upload"""
    try:
        if 'photo' not in request.files:
            return jsonify({'status': 'error', 'message': 'Tidak ada file yang dipilih!'}), 400
        
        file = request.files['photo']
        title = request.form.get('title', '')
        description = request.form.get('description', '')
        uploader = request.form.get('uploader', 'Anonymous')
        category = request.form.get('category', 'general')
        
        if not file or file.filename == '' or file.filename is None:
            return jsonify({'status': 'error', 'message': 'Tidak ada file yang dipilih!'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'status': 'error', 'message': 'Format file tidak didukung! Gunakan PNG, JPG, JPEG, atau GIF'}), 400
        
        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        original_filename = secure_filename(file.filename or 'photo')
        filename = f"{timestamp}_{original_filename}"
        
        # Save file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(filepath)
        
        # Save to database
        photo = Photo(
            filename=filename,
            title=title or original_filename,
            description=description or '',
            uploader_name=uploader,
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
def like_photo(photo_id):
    """Like a photo"""
    try:
        user_name = request.json.get('user_name', 'Anonymous')
        
        photo = Photo.query.get_or_404(photo_id)
        
        # Check if already liked
        existing_like = Like.query.filter_by(photo_id=photo_id, user_name=user_name).first()
        
        if existing_like:
            # Unlike
            db.session.delete(existing_like)
            photo.likes_count = max(0, photo.likes_count - 1)
            db.session.commit()
            return jsonify({
                'status': 'success',
                'action': 'unliked',
                'likes_count': photo.likes_count
            })
        else:
            # Like
            like = Like(photo_id=photo_id, user_name=user_name)
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
def add_comment(photo_id):
    """Add comment to a photo"""
    try:
        user_name = request.json.get('user_name', 'Anonymous')
        comment_text = request.json.get('comment', '')
        
        if not comment_text:
            return jsonify({'status': 'error', 'message': 'Komentar tidak boleh kosong!'}), 400
        
        photo = Photo.query.get_or_404(photo_id)
        
        comment = Comment(
            photo_id=photo_id,
            user_name=user_name,
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
    """Get all comments for a photo"""
    photo = Photo.query.get_or_404(photo_id)
    comments = Comment.query.filter_by(photo_id=photo_id).order_by(Comment.created_at.desc()).all()
    return jsonify({
        'comments': [c.to_dict() for c in comments]
    })

# Initialize database and seed data
def init_db():
    """Initialize database and add students data"""
    with app.app_context():
        db.create_all()
        
        # Check if students already exist
        if Student.query.count() == 0:
            # Add 31 students
            students_data = [
                { "id": 1, "name": "Abdirrohman Maulana Sumantri", "nickname": "Rohman" },
                { "id": 2, "name": "Abiyyu Zharif", "nickname": "Abiyyu" },
                { "id": 3, "name": "Ahmad Fauzi", "nickname": "Fauzi" },
                { "id": 4, "name": "Allysa Margareth Matheos", "nickname": "Allysa" },
                { "id": 5, "name": "Andika Harsya Pratama", "nickname": "Andika" },
                { "id": 6, "name": "Andien Qurrotu'aini", "nickname": "Andien" },
                { "id": 7, "name": "Bintang Abdullah Dzaki Darmawan", "nickname": "Bintang" },
                { "id": 8, "name": "Denok Estima Sari", "nickname": "Denok" },
                { "id": 9, "name": "El Rasya Adena Putra", "nickname": "Rasya" },
                { "id": 10, "name": "Fadliyyah Hubbah", "nickname": "Fadliyyah" },
                { "id": 11, "name": "Fatih Nubaid Islam", "nickname": "Fatih" },
                { "id": 12, "name": "Harumi Cahaya Hadis Saputra", "nickname": "Harumi" },
                { "id": 13, "name": "Hizbul aulia Ananda Fahdrian", "nickname": "Hizbul" },
                { "id": 14, "name": "Jorge Alvin Alfarezy", "nickname": "Jorge" },
                { "id": 15, "name": "Kanza Dwi Almirani", "nickname": "Kanza" },
                { "id": 16, "name": "Muhammad Hilmi Firjatullah Adi", "nickname": "Hilmi" },
                { "id": 17, "name": "Muhammad Zidan Farhatan", "nickname": "Zidan" },
                { "id": 18, "name": "Muhamad Farhan", "nickname": "Farhan" },
                { "id": 19, "name": "Muhammad Ridho Alsyaqif", "nickname": "Ridho" },
                { "id": 20, "name": "Nabila Carrisa Putri", "nickname": "Nabila" },
                { "id": 21, "name": "Nadya Shafwah Ramadani", "nickname": "Nadya" },
                { "id": 22, "name": "Putri Nayla Nuraeni", "nickname": "Nayla" },
                { "id": 23, "name": "Raka Iqbal Fernanda", "nickname": "Raka" },
                { "id": 24, "name": "Riangga Pratama", "nickname": "Riangga" },
                { "id": 25, "name": "Rizky Manna'isya Naruyun", "nickname": "Rizky" },
                { "id": 26, "name": "Rianti Mulya Sari", "nickname": "Rianti" },
                { "id": 27, "name": "Saiful Untari Bahtiar", "nickname": "Saiful" },
                { "id": 28, "name": "Satria dwi Novan", "nickname": "Satria" },
                { "id": 29, "name": "Vadlan Elka Ramadhan", "nickname": "Vadlan" },
                { "id": 30, "name": "Vadya Elka Rahmadani", "nickname": "Vadya" },
                { "id": 31, "name": "Willy Toto Pandy", "nickname": "Willy" }
            ]
            
            for student_data in students_data:
                student = Student(
                    id=student_data['id'],
                    name=student_data['name'],
                    nickname=student_data['nickname']
                )
                db.session.add(student)
            
            db.session.commit()
            print("✅ Database initialized with 31 students!")

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
