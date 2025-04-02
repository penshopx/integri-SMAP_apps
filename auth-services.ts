// Tambahkan ke auth-service.ts
import { generateTokens, verifyToken } from './jwt-service';

// Perbarui metode login
login(credentials: LoginCredentials): AuthState {
  const { email, password } = credentials;
  
  const user = this.getUserByEmail(email);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  if (!user.isActive) {
    throw new Error("User account is inactive");
  }
  
  // Update last login
  this.updateUser(user.id, {
    lastLogin: new Date().toISOString(),
  });
  
  // Generate JWT tokens
  const { accessToken, refreshToken } = generateTokens(user.id);
  
  // Store refresh token (in a real app, this would be in a secure database)
  user.refreshToken = refreshToken;
  this.updateUser(user.id, { refreshToken });
  
  const authState: AuthState = {
    isAuthenticated: true,
    user,
    token: accessToken,
  };
  
  this.saveAuthState(authState);
  
  return authState;
}