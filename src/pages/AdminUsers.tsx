import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import type { Tables } from "@/integrations/supabase/types";

type ActiveSession = Tables<"active_sessions">;

const AdminUsers = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("active_sessions")
      .select("*")
      .gte("last_seen", fiveMinAgo)
      .order("last_seen", { ascending: false });

    setSessions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 10) return "Şu anda aktif";
    if (seconds < 60) return `${seconds} saniye önce`;
    return `${Math.floor(seconds / 60)} dakika önce`;
  };

  return (
    <AdminLayout title="Aktif Kullanıcılar">
      <div className="bg-card border border-border rounded">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-body">
            Son 5 dakika içinde aktif olan kullanıcılar (otomatik güncellenir)
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-body text-foreground font-medium">{sessions.length} aktif</span>
          </div>
        </div>

        {loading ? (
          <p className="p-4 text-muted-foreground font-body">Yükleniyor...</p>
        ) : sessions.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground font-body">Şu anda aktif kullanıcı yok.</p>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-foreground font-medium">
                    {session.user_id?.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    Sayfa: {session.page || "Bilinmiyor"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground font-body">{getTimeAgo(session.last_seen)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
