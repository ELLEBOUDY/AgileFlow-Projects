import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="email">Email address</label>
          <Input id="email" type="email" placeholder="name@example.com" required />
        </div>
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>
          <Input id="password" type="password" required />
        </div>
        
        <Button type="submit" className="w-full mt-6">Sign In</Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link>
      </div>
    </div>
  );
}
