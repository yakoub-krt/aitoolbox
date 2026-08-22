import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdSenseLoader } from "@/components/AdSlot";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/AdminDashboard";
import ArticlePage from "./pages/ArticlePage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NewsletterAdminPage from "./pages/NewsletterAdminPage";
import SearchPage from "./pages/SearchPage";
import SectionPage from "./pages/SectionPage";
import StaticPage from "./pages/StaticPage";
import ToolsAdminPage from "./pages/ToolsAdminPage";
import ToolsDirectoryPage from "./pages/ToolsDirectoryPage";
import CompareToolsPage from "./pages/CompareToolsPage";
import UnsubscribePage from "./pages/UnsubscribePage";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/articles/:slug" component={ArticlePage} /><Route path="/sections/:slug" component={SectionPage} /><Route path="/tools" component={ToolsDirectoryPage} /><Route path="/compare" component={CompareToolsPage} /><Route path="/search" component={SearchPage} /><Route path="/admin" component={AdminDashboard} /><Route path="/admin/subscribers" component={NewsletterAdminPage} /><Route path="/admin/tools" component={ToolsAdminPage} /><Route path="/unsubscribe/:token" component={UnsubscribePage} /><Route path="/about" component={StaticPage} /><Route path="/contact" component={StaticPage} /><Route path="/privacy" component={StaticPage} /><Route path="/affiliate-disclosure" component={StaticPage} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><AdSenseLoader /><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
