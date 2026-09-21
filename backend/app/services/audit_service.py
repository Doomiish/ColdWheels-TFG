from ..extensions import db
from ..models import AuditError, AuditInformation


def record_information(operation, result, description, user_id=None, sale_id=None):
    entry = AuditInformation(
        operation=operation,
        result=result,
        description=description,
        user_id=user_id,
        sale_id=sale_id,
    )
    db.session.add(entry)
    return entry


def record_error(operation, description, user_id=None, sale_id=None):
    """Persist a deliberately non-sensitive error description in a new transaction."""
    try:
        db.session.add(
            AuditError(
                operation=operation,
                description=description[:500],
                user_id=user_id,
                sale_id=sale_id,
            )
        )
        db.session.commit()
    except Exception:
        db.session.rollback()
