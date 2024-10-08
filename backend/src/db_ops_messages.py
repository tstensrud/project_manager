from uuid import uuid4
import time
from . import models, db
from . import globals

def get_inbox(uuid: str) -> tuple[models.Users, models.Messages]:
    messages = db.session.query(models.Messages, models.Users).join(models.Users, models.Messages.sent_to_uid == models.Users.uuid).filter(models.Messages.sent_to_uid == uuid).all()
    if messages:
        return messages
    return None

def get_sent_messages(uuid: str) -> tuple[models.Users, models.Messages]:
    messages = db.session.query(models.Messages, models.Users).join(models.Users, models.Messages.sent_by_uid == models.Users.uuid).filter(models.Messages.sent_by_uid == uuid).all()
    if messages:
        return messages
    return None

def new_message(sender_uuid: str, receiver_uuid: str, message: str) -> bool:
    message_uid = str(uuid4())
    conversation_uid = str(uuid4())
    timestamp = int(time.time() * 1000)
    new_message = models.Messages(uid=message_uid,
                                  conversation_uid=conversation_uid,
                                  parent_msg_uid=None,
                                  sent_by_uid=sender_uuid,
                                  sent_to_uid=receiver_uuid,
                                  message_content=message,
                                  timestamp=timestamp)
    try:
        db.session.add(new_message)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Could not send msg: {e}")
        return False

def reply_to_message(parent_msg_uid: str, conversation_uid: str, sender_uuid: str, receiver_uuid: str, message: str) -> bool:
    message_uid = str(uuid4())
    timestamp = int(time.time() * 1000)
    new_message = models.Messages(uid=message_uid,
                                  conversation_uid=conversation_uid,
                                  parent_msg_uid=parent_msg_uid,
                                  sent_by_uid=sender_uuid,
                                  sent_to_uid=receiver_uuid,
                                  message=message,
                                  timestamp=timestamp)
    try:
        db.session.add(new_message)
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Could not send reply msg: {e}")
        return False


