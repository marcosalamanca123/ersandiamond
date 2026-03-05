import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Package, Settings, Users, LogOut, Menu, X } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Ürünler", href: "/admin/products", icon: Package },
  { name: "Kullanıcılar", href: "/admin/users", icon: Users },
  { name: "Site Ayarları", href: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-muted">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-60 bg-card border-r border-border transform transition-transform md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-border">
            <Link to="/" className="font-display text-lg font-bold text-foreground tracking-wider">
              ERSAN DIAMOND
            </Link>
            <p className="text-xs text-muted-foreground font-body mt-1">Admin Panel</p>
          </div>
          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body transition-colors ${
                  location.pathname === item.href
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-foreground/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
            <button className="md:hidden text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="font-display text-xl text-foreground">{title}</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;
