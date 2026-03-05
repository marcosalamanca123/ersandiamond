import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Package, Users, Eye, Settings } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, activeUsers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: activeCount } = await supabase
        .from("active_sessions")
        .select("*", { count: "exact", head: true })
        .gte("last_seen", fiveMinAgo);

      setStats({
        products: productCount || 0,
        activeUsers: activeCount || 0,
      });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: "Toplam Ürün", value: stats.products, icon: Package, color: "text-primary" },
    { label: "Aktif Kullanıcı", value: stats.activeUsers, icon: Eye, color: "text-accent" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-body">{card.label}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
