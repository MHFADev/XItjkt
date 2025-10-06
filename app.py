import os
from flask import Flask, render_template, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Data Kelas XI TJKT 1
CLASS_DATA = {
    'name': 'XI TJKT 1',
    'full_name': 'Kelas XI Teknik Jaringan Komputer dan Telekomunikasi 1',
    'year': '2024/2025',
    'total_students': 32,
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
