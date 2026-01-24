import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrackedLink } from "@/components/TrackedLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logoImage from "@assets/generated_images/neurovantage_minimalist_brain_logo_icon_in_teal_and_navy.png";
import { CTA } from "@/lib/cta";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const isDashboard = location.startsWith("/dashboard");

  if (isDashboard) return null;

  const handleLogout = () => {
    void logout();
    navigate("/clinic/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src={logoImage}
            alt="Prime State Health"
            width={32}
            height={32}
            decoding="async"
            className="h-8 w-8 object-contain"
          />
          <span className="font-display text-xl font-bold tracking-tight text-primary">
            Prime State Health
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            How it Works
          </Link>
          <Link href="/for-patients" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            For Patients
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Solutions
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-3">
              <div className="flex flex-col gap-1">
                <DropdownMenuItem
                  asChild
                  className="w-full cursor-pointer justify-start rounded-md bg-muted/60 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10"
                >
                  <TrackedLink
                    href="/solutions/cognitive-testing"
                    cta="solutions_cognitive_testing"
                    location="header_solutions"
                  >
                    Cognitive Testing
                  </TrackedLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="w-full cursor-pointer justify-start rounded-md bg-muted/60 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10"
                >
                  <Link href={CTA.clinic.href}>{CTA.clinic.label}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="w-full cursor-pointer justify-start rounded-md bg-muted/60 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10"
                >
                  <TrackedLink
                    href="/blood-testing"
                    cta="solutions_blood_testing"
                    location="header_solutions"
                  >
                    Blood Testing
                  </TrackedLink>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <TrackedLink href={CTA.primary.href} cta="try_free_screener" location="header">
            <Button className="bg-primary text-white hover:bg-primary/90 font-medium">
              {CTA.primary.label}
            </Button>
          </TrackedLink>
          {!isLoading &&
            (isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </>
            ) : (
              <TrackedLink
                href="/clinic/login"
                cta="clinic_login"
                location="header"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Clinic Login
              </TrackedLink>
            ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden p-2 text-primary"
          onClick={() =>
            setIsOpen((prev) => {
              const next = !prev;
              if (!next) setIsSolutionsOpen(false);
              return next;
            })
          }
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white p-4 flex flex-col gap-4 absolute w-full shadow-lg">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-foreground py-2 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            How it Works
          </Link>
          <Link
            href="/for-patients"
            className="text-sm font-medium text-foreground py-2 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            For Patients
          </Link>
          <Collapsible open={isSolutionsOpen} onOpenChange={setIsSolutionsOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between text-sm font-medium text-foreground py-2"
              >
                Solutions
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isSolutionsOpen ? "rotate-180" : ""}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 flex flex-col gap-2">
              <TrackedLink
                href="/solutions/cognitive-testing"
                cta="solutions_cognitive_testing"
                location="header_solutions"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  setIsSolutionsOpen(false);
                }}
              >
                Cognitive Testing
              </TrackedLink>
              <Link
                href={CTA.clinic.href}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  setIsSolutionsOpen(false);
                }}
              >
                {CTA.clinic.label}
              </Link>
              <TrackedLink
                href="/blood-testing"
                cta="solutions_blood_testing"
                location="header_solutions"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  setIsSolutionsOpen(false);
                }}
              >
                Blood Testing
              </TrackedLink>
            </CollapsibleContent>
          </Collapsible>
          <TrackedLink
            href={CTA.primary.href}
            cta="try_free_screener"
            location="header"
            onClick={() => setIsOpen(false)}
          >
            <Button className="w-full">
              {CTA.primary.label}
            </Button>
          </TrackedLink>
          {!isLoading &&
            (isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-foreground py-2 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="text-sm font-medium text-foreground py-2 text-left"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <TrackedLink
                href="/clinic/login"
                cta="clinic_login"
                location="header"
                className="text-sm font-medium text-foreground py-2 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Clinic Login
              </TrackedLink>
            ))}
        </div>
      )}
    </nav>
  );
}
