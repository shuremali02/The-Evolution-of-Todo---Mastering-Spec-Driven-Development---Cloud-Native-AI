# JWT Token Specification

**Feature**: 002-authentication
**Standard**: RFC 7519 (JSON Web Tokens)
**Algorithm**: HS256 (HMAC with SHA-256)

## Token Structure

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: Algorithm used for signing (HS256)
- `typ`: Token type (JWT)

### Payload (Claims)

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "exp": 1735689600,
  "iat": 1735686000
}
```

**Required Claims**:

| Claim | Type | Description | Example |
|-------|------|-------------|---------|
| `sub` | string | Subject (User ID as UUID) | `"550e8400-e29b-41d4-a716-446655440000"` |
| `exp` | number | Expiration time (Unix timestamp) | `1735689600` (60 min from iat) |
| `iat` | number | Issued at time (Unix timestamp) | `1735686000` |

**Prohibited Claims**:
- Password (hashed or plaintext)
- Sensitive user data (PII beyond ID)
- Admin flags (for Phase-2)
- Refresh token

### Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

- Secret from `JWT_SECRET_KEY` environment variable
- Must be at least 32 bytes (256 bits) for HS256 security

## Token Lifetime

- **Duration**: 60 minutes (3600 seconds)
- **No refresh tokens** in Phase-2 (simplification)
- **Expiration enforcement**: Backend validates `exp` on every request

## Token Generation (Backend)

```python
from datetime import datetime, timedelta
from jose import jwt
import os

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(user_id: str) -> str:
    """Generate JWT access token for authenticated user."""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": user_id,  # User ID as subject
        "exp": expire,   # Expiration timestamp
        "iat": datetime.utcnow()  # Issued at timestamp
    }

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt
```

## Token Validation (Backend)

```python
from jose import JWTError, jwt
from fastapi import HTTPException, status

def decode_jwt(token: str) -> dict:
    """Decode and validate JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

def get_user_id_from_token(token: str) -> str:
    """Extract user ID from JWT token."""
    payload = decode_jwt(token)
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing subject"
        )

    return user_id
```

## Token Usage (API Requests)

### Authorization Header

All protected endpoints require JWT in Authorization header:

```http
GET /api/v1/tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Format**: `Bearer <token>`

### Dependency Injection (FastAPI)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Dependency to extract and validate user ID from JWT.

    Usage in endpoints:
        @router.get("/protected")
        async def protected_route(user_id: str = Depends(get_current_user_id)):
            # user_id is now guaranteed valid
            pass
    """
    token = credentials.credentials
    return get_user_id_from_token(token)
```

## Token Storage (Frontend)

### Preferred: httpOnly Cookies

```typescript
// Backend sets cookie in response
response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=True,  // HTTPS only (production)
    samesite="lax",
    max_age=3600  // 60 minutes
)

// Frontend: Cookie sent automatically with requests
// No manual attachment needed
```

### Alternative: sessionStorage

```typescript
// Store token
sessionStorage.setItem('access_token', token)

// Retrieve token
const token = sessionStorage.getItem('access_token')

// Attach to requests
headers: {
  'Authorization': `Bearer ${token}`
}

// Clear on logout
sessionStorage.removeItem('access_token')
```

## Token Validation Flow

```
1. Client sends request with token
   ↓
2. Backend extracts token from Authorization header
   ↓
3. Backend decodes token and verifies signature
   ↓
4. Backend checks expiration (exp claim)
   ↓
5. Backend extracts user_id from sub claim
   ↓
6. Backend processes request with user_id context
```

## Error Responses

### Missing Token

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "detail": "Not authenticated"
}
```

### Invalid Signature

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "detail": "Invalid or expired token"
}
```

### Expired Token

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "detail": "Invalid or expired token"
}
```

### Missing Subject Claim

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "detail": "Invalid token: missing subject"
}
```

## Security Best Practices

### Secret Key Management

✅ **DO**:
- Generate with cryptographically secure random generator
- Store in environment variable
- Use different secrets per environment (dev, prod)
- Rotate periodically (invalidates all existing tokens)
- Minimum 32 bytes (256 bits) length

❌ **DON'T**:
- Hardcode in source code
- Commit to version control
- Share across multiple applications
- Use weak/predictable values (e.g., "secret", "password")

### Token Best Practices

✅ **DO**:
- Validate on every protected request
- Check expiration timestamp
- Use secure transmission (HTTPS in production)
- Store in httpOnly cookies (XSS protection)
- Log out on 401 errors

❌ **DON'T**:
- Include sensitive data in payload
- Use excessively long expiration times
- Transmit over HTTP (non-encrypted)
- Store in localStorage (XSS vulnerable)
- Trust client-provided user IDs

## Testing

### Valid Token Generation (Tests)

```python
import pytest
from datetime import datetime, timedelta
from jose import jwt

def test_create_valid_token():
    """Test JWT token creation."""
    user_id = "test-user-id"
    token = create_access_token(user_id)

    # Decode without validation (for testing)
    payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])

    assert payload["sub"] == user_id
    assert "exp" in payload
    assert "iat" in payload
    assert payload["exp"] > payload["iat"]
```

### Expired Token (Tests)

```python
def test_expired_token_rejected():
    """Test that expired tokens are rejected."""
    # Create token that expires immediately
    expire = datetime.utcnow() - timedelta(seconds=1)
    payload = {"sub": "test-user", "exp": expire, "iat": datetime.utcnow()}
    expired_token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

    with pytest.raises(HTTPException) as exc_info:
        decode_jwt(expired_token)

    assert exc_info.value.status_code == 401
```

### Invalid Signature (Tests)

```python
def test_invalid_signature_rejected():
    """Test that tokens with invalid signature are rejected."""
    valid_token = create_access_token("test-user")

    # Tamper with token
    tampered_token = valid_token[:-10] + "TAMPERED00"

    with pytest.raises(HTTPException) as exc_info:
        decode_jwt(tampered_token)

    assert exc_info.value.status_code == 401
```

## Frontend Integration

### API Client with Token

```typescript
class ApiClient {
  private getToken(): string | null {
    return sessionStorage.getItem('access_token')
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken()

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired or invalid - redirect to login
      sessionStorage.removeItem('access_token')
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Request failed')
    }

    return response.json()
  }
}
```

## References

- **RFC 7519**: https://datatracker.ietf.org/doc/html/rfc7519
- **JWT.io Debugger**: https://jwt.io/
- **python-jose docs**: https://python-jose.readthedocs.io/
- **FastAPI Security Tutorial**: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/

---

**Related Documents**:
- `data-model.md` - User entity definition
- `openapi.yaml` - API contract with auth endpoints
- `quickstart.md` - Implementation guide
