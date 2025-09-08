import os
import sys
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

def send_feedback_email(name, email, message):
    """Send feedback email to hilmimax109@gmail.com"""
    
    sendgrid_key = os.environ.get('SENDGRID_API_KEY')
    if not sendgrid_key:
        print("SENDGRID_API_KEY environment variable not set")
        return False
    
    try:
        sg = SendGridAPIClient(sendgrid_key)
        
        # Create the email content
        subject = f"📩 Portfolio Feedback dari {name}"
        
        html_content = f"""
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #000000, #333333); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px;">🌟 Portfolio Feedback</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Pesan baru dari website portfolio</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="border-left: 4px solid #000; padding-left: 20px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">👤 Pengirim</h3>
                    <p style="margin: 0; font-size: 16px; color: #666;"><strong>{name}</strong></p>
                    <p style="margin: 5px 0 0 0; color: #888;">{email}</p>
                </div>
                
                <div style="border-left: 4px solid #666; padding-left: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">💬 Pesan</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; line-height: 1.6; color: #444;">
{message.replace(chr(10), '<br>')}
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666;">
                <p style="margin: 0; font-size: 14px;">
                    Dikirim dari portfolio website MHFADEV<br>
                    🕒 """ + __import__('datetime').datetime.now().strftime('%d %B %Y, %H:%M WIB') + """
                </p>
            </div>
        </div>
        """
        
        text_content = f"""
        PORTFOLIO FEEDBACK

        Pengirim: {name}
        Email: {email}
        
        Pesan:
        {message}
        
        Dikirim dari portfolio website MHFADEV
        Waktu: """ + __import__('datetime').datetime.now().strftime('%d %B %Y, %H:%M WIB') + """
        """
        
        mail = Mail(
            from_email=Email("noreply@portfolio.dev", "MHFADEV Portfolio"),
            to_emails=To("hilmimax109@gmail.com"),
            subject=subject
        )
        
        mail.content = [
            Content("text/plain", text_content),
            Content("text/html", html_content)
        ]
        
        # Send the email
        response = sg.send(mail)
        
        print(f"Email sent successfully. Status code: {response.status_code}")
        return True
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False