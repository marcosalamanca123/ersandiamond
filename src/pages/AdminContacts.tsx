import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminContacts = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data as ContactMessage[]);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: ContactMessage) => {
    await supabase.from("contact_messages").update({ is_read: !msg.is_read }).eq("id", msg.id);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    toast({ title: "Silindi", description: "Mesaj başarıyla silindi." });
    fetchMessages();
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <AdminLayout title={`İletişim Mesajları ${unreadCount > 0 ? `(${unreadCount} yeni)` : ""}`}>
      {loading ? (
        <p className="text-muted-foreground font-body">Yükleniyor...</p>
      ) : messages.length === 0 ? (
        <p className="text-muted-foreground font-body">Henüz mesaj yok.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border p-4 ${msg.is_read ? "bg-card border-border" : "bg-primary/5 border-primary/20"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-body font-semibold text-foreground text-sm">{msg.name}</span>
                    {!msg.is_read && <Badge variant="default" className="text-[10px]">Yeni</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground font-body mb-0.5">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                  <p className="text-xs text-muted-foreground font-body mb-2">
                    {new Date(msg.created_at).toLocaleString("tr-TR")}
                  </p>
                  <p className="text-sm text-foreground font-body whitespace-pre-wrap">{msg.message}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => toggleRead(msg)} title={msg.is_read ? "Okunmadı işaretle" : "Okundu işaretle"}>
                    {msg.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMessage(msg.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContacts;
