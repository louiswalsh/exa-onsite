# Backend API

A clean, organized Flask application for managing websets and their items using in-memory storage.

## Project Structure

```
backend/
├── app.py              # Main application entry point
├── .env                # Environment variables (e.g., EXA_API_KEY)
├── storage.py          # In-memory data storage
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── models/            # Data models
│   ├── __init__.py
│   ├── base.py        # Base model with common functionality
│   ├── webset.py      # Webset model
│   └── webset_item.py # WebsetItem model
└── routes/            # API endpoints
    ├── __init__.py
    ├── health.py      # Health check endpoints
    └── websets.py     # Webset-related endpoints
```

## Key Features

### Clean Architecture
- **Application Factory Pattern**: Used in `app.py` for better testing and configuration
- **Blueprint Organization**: Routes organized into logical blueprints
- **Model Abstraction**: Models provide clean interface to data storage
- **Configuration Management**: Environment-based via `.env` (like exatention)

### Data Storage
- **In-Memory Storage**: Simple, fast storage for demo purposes
- **Sample Data**: Pre-loaded with example websets and items
- **BaseModel**: Provides common methods like `to_dict()` and date formatting

### Data Models
- **Webset**: Main webset entity
- **WebsetItem**: Individual items within a webset

### API Endpoints
- `GET /health` - Health check
- `GET /websets` - List all websets
- `GET /websets/<id>` - Get specific webset with items
- `GET /websets/<id>/items` - Get all items for a webset

## Running the Application

### Local Development
```bash
pip install -r requirements.txt
python app.py
```

### Docker
```bash
docker build -t backend .
docker run -p 8080:8080 backend
```

### With Docker Compose
```bash
# From project root
make up
```

## Configuration

Environment variables:
- `FLASK_ENV`: Set to 'development' for debug mode

## Adding New Features

### New Model
1. Create model file in `models/` directory
2. Inherit from `BaseModel`
3. Add methods to interact with storage
4. Add to `models/__init__.py`

### New Route
1. Create blueprint file in `routes/` directory
2. Add to `routes/__init__.py`
3. Register blueprint in `app.py`

### New Data
1. Modify `storage.py` to add new sample data
2. Update models to handle new data types
