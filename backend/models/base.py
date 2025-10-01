from datetime import datetime

class BaseModel:
    @staticmethod
    def format_datetime(dt):
        if dt and hasattr(dt, 'isoformat'):
            return dt.isoformat()
        return dt

    @staticmethod
    def to_dict(item):
        if not item:
            return None
        result = item.copy()
        for key, value in result.items():
            if hasattr(value, 'isoformat'):
                result[key] = value.isoformat()
        return result
