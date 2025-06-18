
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UtensilsCrossed, LogOut, Info, MessagesSquare } from 'lucide-react'; // Added MessagesSquare
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinkClasses = (path: string) => 
    cn(
      "px-2 py-2 sm:px-3 rounded-md text-sm font-medium transition-colors flex items-center",
      pathname === path 
        ? "bg-primary-foreground text-primary" 
        : "hover:bg-primary-foreground/10 hover:text-accent"
    );

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/restaurants" className="flex items-center space-x-2 group">
            <UtensilsCrossed className="h-8 w-8 text-accent group-hover:animate-pulse" />
            <h1 className="text-lg sm:text-2xl font-headline font-bold group-hover:text-accent transition-colors">
              Gadag Grub Guide
            </h1>
          </Link>
          <div className="flex items-center space-x-1 sm:space-x-3">
            {currentUser && (
              <>
                <Link href="/restaurants" className={navLinkClasses("/restaurants")}>
                   <UtensilsCrossed className="mr-1 h-4 w-4 sm:mr-2" /> 
                  <span className="hidden sm:inline">Restaurants</span>
                  <span className="sm:hidden">Restaurants</span>
                </Link>
                <Link href="/customer-reviews" className={navLinkClasses("/customer-reviews")}>
                  <MessagesSquare className="mr-1 h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">All Reviews</span>
                   <span className="sm:hidden">Reviews</span>
                </Link>
                <Link href="/about" className={navLinkClasses("/about")}>
                  <Info className="mr-1 h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">About Us</span>
                   <span className="sm:hidden">About</span>
                </Link>
                <span className="text-sm hidden lg:block border-l border-primary-foreground/30 pl-2 sm:pl-3">
                  Hi, {currentUser.username}!
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="hover:bg-primary-foreground hover:text-primary transition-colors px-2 sm:px-3"
                >
                  <LogOut className="mr-1 h-4 w-4 sm:mr-2" />
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
