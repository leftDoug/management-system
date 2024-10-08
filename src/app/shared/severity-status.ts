import {
  Agreement,
  Status,
} from '../agreements/interfaces/agreement.interface';

export function getStatus(agreement: Agreement): Status {
  const today: Date = new Date();
  const date: Date = new Date(agreement.compilanceDate);

  if (agreement.canceled) return Status.canceled;

  if (agreement.completed) return Status.fulfilled;
  else if (today.getTime() < date.getTime()) return Status.inProcess;
  else return Status.unfulfilled;
}

export function getSeverity(
  agreement: Agreement | null,
  agreementStatus: Status | null
) {
  let status: Status;

  if (agreement) status = getStatus(agreement);
  else status = agreementStatus!;

  switch (status) {
    case Status.canceled:
      return 'secondary';
    case Status.fulfilled:
      return 'success';
    case Status.inProcess:
      return 'info';
    case Status.unfulfilled:
      return 'danger';
  }
}
