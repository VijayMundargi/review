
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Target, Settings2, MapPin, Users2, Mail, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import Head from 'next/head';

// Though metadata is typically defined in server components or layout files,
// we can define it here for clarity for this specific page.
// However, for App Router, this would ideally be an exported const metadata.
// For client components, dynamic metadata needs `use client` and Head from 'next/head'.

export default function AboutUsPage() {
  return (
    <>
      <Head>
        <title>About Us - Gadag Grub Guide</title>
        <meta name="description" content="Learn more about Gadag Grub Guide, our mission, and how we help you discover the best local restaurants in Gadag, Karnataka." />
      </Head>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <Card className="shadow-xl">
          <CardHeader className="text-center bg-muted/30 p-6">
            <Info className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl sm:text-4xl font-headline text-primary">About Gadag Grub Guide</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Your trusted companion for exploring the culinary delights of Gadag, Karnataka.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            <section aria-labelledby="introduction-heading" className="animate-slide-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center mb-3">
                <Lightbulb className="h-7 w-7 text-accent mr-3 shrink-0" />
                <h2 id="introduction-heading" className="text-2xl font-semibold text-primary">
                  Welcome to Gadag Grub Guide!
                </h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                Gadag Grub Guide is a dedicated local review platform designed to help food lovers discover the best dining experiences in and around Gadag, Karnataka. From authentic South Indian meals and traditional North Karnataka cuisine to delightful multi-cuisine options and quick bites, our goal is to make your food journey easier, more informed, and exceptionally enjoyable. We connect you with the heart of Gadag&apos;s food scene.
              </p>
            </section>

            <Separator />

            <section aria-labelledby="mission-heading" className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-3">
                <Target className="h-7 w-7 text-accent mr-3 shrink-0" />
                <h2 id="mission-heading" className="text-2xl font-semibold text-primary">
                  Our Mission
                </h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                Our mission is twofold: to empower diners with honest, transparent, and user-driven reviews, and to champion our wonderful local restaurants by boosting their visibility and connecting them with a vibrant community of food enthusiasts. We believe in the power of shared experiences and the unique charm of local eateries that form the culinary backbone of Gadag.
              </p>
            </section>

            <Separator />

            <section aria-labelledby="how-it-works-heading" className="animate-slide-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center mb-4">
                <Settings2 className="h-7 w-7 text-accent mr-3 shrink-0" />
                <h2 id="how-it-works-heading" className="text-2xl font-semibold text-primary">
                  How It Works
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground flex items-center">
                    <MapPin size={20} className="mr-2 text-secondary" />
                    Discover Restaurants
                  </h3>
                  <p className="text-foreground/90 leading-relaxed ml-7">
                    Easily browse a curated list of restaurants in Gadag. Explore detailed information, including descriptions, cuisine types, and images to help you choose your next meal.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground flex items-center">
                    <Users2 size={20} className="mr-2 text-secondary" />
                    Read Authentic Reviews
                  </h3>
                  <p className="text-foreground/90 leading-relaxed ml-7">
                    Dive into genuine reviews and ratings submitted by fellow food lovers. Get real insights into the food, ambiance, and service before you visit. All reviews on our platform are from real users like you!
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground flex items-center">
                    <Mail size={20} className="mr-2 text-secondary" />
                    Share Your Experience
                  </h3>
                  <p className="text-foreground/90 leading-relaxed ml-7">
                    Had a memorable meal? Or perhaps some constructive feedback? Share your own thoughts by submitting a review. Your voice helps others make informed decisions and supports local businesses.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section aria-labelledby="local-focus-heading" className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center mb-3">
                <MapPin className="h-7 w-7 text-accent mr-3 shrink-0" />
                <h2 id="local-focus-heading" className="text-2xl font-semibold text-primary">
                  Our Focus on Local
                </h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                Gadag has a vibrant and diverse culinary landscape, and we&apos;re passionate about showcasing it. Gadag Grub Guide is built with a &apos;local-first&apos; mindset. We strive to be more than just a review site; we aim to be a community hub that celebrates and supports the incredible local restaurants that make Gadag unique. By focusing on our town, we help local chefs, restaurateurs, and their teams thrive.
              </p>
            </section>
            
            <Separator />

            <section aria-labelledby="contact-heading" className="text-center animate-slide-in-up" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center justify-center mb-3">
                <Users2 className="h-7 w-7 text-accent mr-3 shrink-0" />
                <h2 id="contact-heading" className="text-2xl font-semibold text-primary">
                  Join Our Community!
                </h2>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                We&apos;re always looking to improve and grow our community of food lovers and local champions. Have feedback, suggestions, or want to see your favorite Gadag eatery featured? We&apos;d love to hear from you!
              </p>
              <p className="mt-3 text-foreground/90">
                Contact us at: <a href="mailto:info@gadaggrubguide.com" className="text-accent hover:underline font-medium">info@gadaggrubguide.com</a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
