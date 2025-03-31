import { Notification } from './interfaces/notification.interface';

// FIXME: cambiar a notificate
export function getNotification(msg: string, ok?: boolean): Notification {
  const notification: Notification = {
    severity: '',
    summary: '',
    detail: msg,
  };

  switch (ok) {
    case true:
      notification.severity = 'success';
      notification.summary = 'ÉXITO';
      break;
    case false:
      notification.severity = 'error';
      notification.summary = 'ERROR';
      break;
    default:
      notification.severity = 'info';
      notification.summary = 'INFORMACIÓN';
      break;
  }

  return notification;
}
