import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from_email = "torbjorn.stensrud@structor.no"
to_email = "torbjorn.stensrud@gmail.com"
password = "Desember2028"

# Create the email content
subject = "Test email from Python via Office 365"
body = "This is a test email sent from Python using Office 365 SMTP."

# Set up the email headers and body
msg = MIMEMultipart()
msg['From'] = from_email
msg['To'] = to_email
msg['Subject'] = subject

msg.attach(MIMEText(body, 'plain'))

# Connect to Office 365's SMTP server
smtp_server = "smtp.office365.com"
smtp_port = 587

try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()  # Secure the connection
    server.login(from_email, password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()
    print("Email sent successfully via Office 365!")
except Exception as e:
    print(f"Error: {e}")