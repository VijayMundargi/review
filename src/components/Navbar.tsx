
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UtensilsCrossed, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/restaurants" className="flex items-center space-x-2 group">
            <UtensilsCrossed className="h-8 w-8 text-accent group-hover:animate-pulse" />
            <h1 className="text-2xl font-headline font-bold group-hover:text-accent transition-colors">
              Gadag Grub Guide
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <span className="text-sm hidden sm:block">Welcome, {currentUser.username}!</span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-primary-foreground hover:text-primary transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
