import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { discoveryNavigationItems, primaryNavigationItems, publicNavigationItems } from "@/lib/siteNavigation";
import NewsletterForm from "@/components/NewsletterForm";
import { BookOpen, ChevronDown, Menu, Search, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function BlogShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchValue.trim();
    if (query) setLocation(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060816] text-slate-100" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#080b1c]/90 backdrop-blur-xl">
        <div className="container flex h-[4.5rem] items-center justify-between gap-3 xl:gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="العودة إلى الصفحة الرئيسية">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_28px_rgba(139,92,246,.35)] transition-transform duration-200 group-hover:-rotate-6 sm:h-10 sm:w-10 sm:rounded-2xl">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="leading-tight">
              <strong className="block font-display text-base tracking-tight text-white sm:text-lg">AIToolBox</strong>
              <span className="hidden text-[10px] font-semibold tracking-[0.2em] text-violet-200/80 sm:block">دليل الأدوات الذكية</span>
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex xl:gap-3" aria-label="التنقل الرئيسي">
            {primaryNavigationItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`whitespace-nowrap text-xs font-semibold transition-colors hover:text-white xl:text-sm ${location === item.path ? "text-violet-300" : "text-slate-400"}`}
              >
                {item.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-9 gap-1.5 whitespace-nowrap px-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white xl:px-3 xl:text-sm" aria-label="فتح قائمة الاستكشاف">
                  استكشف <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" style={{ direction: "rtl" }} className="w-64 border-white/10 bg-[#0b1025] p-2 text-slate-100 shadow-[0_18px_50px_rgba(0,0,0,.42)]">
                <DropdownMenuLabel className="px-3 py-2 text-right text-xs font-black tracking-wide text-violet-200">محتوى ومسارات إضافية</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {discoveryNavigationItems.map(item => (
                  <DropdownMenuItem key={item.path} asChild className={`my-1 cursor-pointer justify-end rounded-xl px-3 py-2.5 text-right text-sm font-semibold ${location === item.path ? "bg-violet-400/15 text-violet-100" : "text-slate-300 focus:bg-cyan-300/10 focus:text-white"}`}>
                    <Link href={item.path}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <form onSubmit={submitSearch} className="hidden items-center gap-2 md:flex" role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                className="h-10 w-40 border-white/10 bg-white/5 pr-9 text-sm text-white placeholder:text-slate-500 focus-visible:ring-violet-400 xl:w-52"
                placeholder="ابحث عن أداة أو مقارنة"
                aria-label="البحث في المقالات"
              />
            </div>
            <Button type="submit" size="sm" className="bg-violet-500 text-white hover:bg-violet-400">
              بحث
            </Button>
          </form>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/search" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300" aria-label="فتح البحث">
              <Search className="h-4 w-4" />
            </Link>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild><Button type="button" variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white" aria-label="فتح قائمة التنقل"><Menu className="h-4 w-4" /></Button></SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm border-white/10 bg-[#080b1c] text-slate-100" dir="rtl">
                <SheetHeader className="border-b border-white/8 pb-5 text-right"><SheetTitle className="font-display text-xl text-white">استكشف AIToolBox</SheetTitle><p className="text-sm leading-6 text-slate-400">اختر المسار الذي يناسب مهمتك الآن.</p></SheetHeader>
                <nav className="mt-5 grid gap-2" aria-label="التنقل على الهاتف">
                  {publicNavigationItems.map(item => <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${location === item.path ? "border-violet-300/40 bg-violet-400/15 text-violet-100" : "border-white/8 bg-white/[0.035] text-slate-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] hover:text-white"}`}>{item.label}</Link>)}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-white/8 bg-[#050711]">
        <div className="container grid gap-8 py-10 md:grid-cols-[1.3fr_.7fr_.7fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-white"><BookOpen className="h-5 w-5 text-violet-300" /><strong className="font-display">AIToolBox</strong></div>
            <p className="max-w-md text-sm leading-7 text-slate-400">مدونة عربية عملية تساعدك على اختيار أدوات الذكاء الاصطناعي، تجربتها، وتوظيفها في الدراسة والعمل والإبداع.</p>
            <NewsletterForm compact />
          </div>
          <div>
            <p className="mb-4 text-sm font-bold text-slate-200">المدونة</p>
            <div className="flex flex-col gap-3 text-sm text-slate-400"><Link href="/">أحدث المقالات</Link><Link href="/sections/comparisons">المقارنات</Link><Link href="/free-alternatives">بدائل مجانية</Link><Link href="/admin">لوحة الإدارة</Link></div>
          </div>
          <div>
            <p className="mb-4 text-sm font-bold text-slate-200">المعلومات</p>
            <div className="flex flex-col gap-3 text-sm text-slate-400"><Link href="/about">من نحن</Link><Link href="/contact">تواصل معنا</Link><Link href="/privacy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link><Link href="/affiliate-disclosure">إفصاح الروابط التابعة</Link></div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-between gap-2 border-t border-white/5 py-5 text-center text-xs text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} AIToolBox. محتوى تقني عربي مستقل.</span><span className="font-medium text-violet-200/80" dir="ltr">By Yakoub Kartouche</span></div>
      </footer>
    </div>
  );
}
