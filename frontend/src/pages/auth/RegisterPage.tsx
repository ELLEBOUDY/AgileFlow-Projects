import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterPage() {
  const navigate = useNavigate();
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate register
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">Enter your details to join AgileFlow</p>
      </div>

      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
          <Input id="name" type="text" placeholder="John Doe" required />
        </div>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="email">Email address</label>
          <Input id="email" type="email" placeholder="name@example.com" required />
        </div>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
          <Input id="password" type="password" required />
        </div>
        
        <Button type="submit" className="w-full mt-6">Create Account</Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </div>
    </div>
  );
}
