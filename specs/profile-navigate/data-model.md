# Data Model: Profile Navigation Enhancement

## Overview
This data model describes the state and data structures needed for the tabbed profile navigation interface.

## State Management

### ProfilePage State
```typescript
interface ProfilePageState {
  activeSection: 'profile' | 'password' | 'email';
  userData: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}
```

### Form States
```typescript
// Password Change Form State
interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  errors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  };
  loading: boolean;
}

// Email Update Form State
interface EmailFormState {
  newEmail: string;
  password: string;
  errors: {
    newEmail?: string;
    password?: string;
    general?: string;
  };
  loading: boolean;
}
```

## Component Props

### ProfileTabLayout Props
```typescript
interface ProfileTabLayoutProps {
  activeSection: 'profile' | 'password' | 'email';
  onSectionChange: (section: 'profile' | 'password' | 'email') => void;
  userData: UserProfile;
}
```

### UserProfileTab Props
```typescript
interface UserProfileTabProps {
  userData: UserProfile;
}
```

### PasswordChangeTab Props
```typescript
interface PasswordChangeTabProps {
  userData: UserProfile;
  onSubmit: (formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}
```

### EmailUpdateTab Props
```typescript
interface EmailUpdateTabProps {
  userData: UserProfile;
  onSubmit: (formData: {
    newEmail: string;
    password: string;
  }) => Promise<void>;
}
```

## API Response Models
These match the existing API contracts:

```typescript
// User Profile Response (unchanged)
interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Password Change Request/Response (unchanged)
interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

// Email Update Request/Response (unchanged)
interface EmailUpdateRequest {
  new_email: string;
  password: string;
}

interface EmailUpdateResponse {
  success: boolean;
  message: string;
}
```

## Validation Rules
- Password length: minimum 8 characters
- Email format: valid email address
- New password and confirmation must match
- Current password must be correct for password change
- Password required for email updates