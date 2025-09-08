import os
from flask import Flask, render_template, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

@app.route('/')
def index():
    """Main portfolio page"""
    return render_template('index.html')

@app.route('/gallery/<gallery_type>')
def gallery(gallery_type):
    """Gallery pages for different project types"""
    if gallery_type not in ['ict', 'coding']:
        return render_template('index.html')
    
    gallery_data = {
        'ict': {
            'title': 'Album IT Support Sekolah',
            'description': 'Dokumentasi kegiatan saya sebagai bagian dari divisi TIK sekolah, mencakup pemeliharaan hardware, troubleshooting jaringan, dan dukungan teknis.',
            'images': [
                {
                    'url': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
                    'title': 'Perbaikan Komputer',
                    'description': 'Memperbaiki PC di laboratorium sekolah'
                },
                {
                    'url': 'https://images.unsplash.com/photo-1621784563330-ca5d824d3ec5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
                    'title': 'Maintenance Jaringan',
                    'description': 'Memeriksa koneksi jaringan sekolah'
                },
                {
                    'url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
                    'title': 'Instalasi Software',
                    'description': 'Menginstal software untuk keperluan pembelajaran'
                }
            ]
        },
        'coding': {
            'title': 'Album Sesi Coding',
            'description': 'Dokumentasi visual dari perjalanan pengembangan web saya. Setiap gambar menceritakan proses belajar dan menciptakan solusi digital.',
            'images': [
                {
                    'url': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
                    'title': 'Mengembangkan Website',
                    'description': 'Proses coding menggunakan React.js'
                },
                {
                    'url': 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
                    'title': 'Diskusi Solusi',
                    'description': 'Berdiskusi dengan teman tentang bug'
                },
                {
                    'url': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
                    'title': 'Debugging Session',
                    'description': 'Menyelesaikan masalah kode kompleks'
                }
            ]
        }
    }
    
    return render_template('gallery.html', 
                         gallery_type=gallery_type, 
                         data=gallery_data[gallery_type])

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # In a real application, you would save this to a database or send an email
        app.logger.info(f"Contact form submission: {name} ({email}): {message}")
        
        return jsonify({
            'status': 'success',
            'message': 'Pesan Anda telah terkirim! Terima kasih.'
        })
    except Exception as e:
        app.logger.error(f"Contact form error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Terjadi kesalahan. Silakan coba lagi.'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
