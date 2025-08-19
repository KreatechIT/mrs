import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberService } from '@/api/services/MemberService.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const MemberLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    login_code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginResponse = await memberService.loginMember(credentials);
      
      // Store tokens
      localStorage.setItem('memberTokens', JSON.stringify({
        access: loginResponse.access,
        refresh: loginResponse.refresh
      }));
      
      // Fetch member data using member_id from login response
      const memberData = await memberService.getMember(loginResponse.member_id);
      
      // Store member data in localStorage for member pages
      localStorage.setItem('memberData', JSON.stringify(memberData));
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Member Login
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your username and login code to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login_code" className="text-gray-300">
                Login Code
              </Label>
              <Input
                id="login_code"
                name="login_code"
                type="text"
                value={credentials.login_code}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Enter your login code"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert className="bg-red-900/50 border-red-700">
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberLogin;