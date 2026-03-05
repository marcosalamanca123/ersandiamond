import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const settingsKeys = [
  { key: "site_name", label: "Site Adı" },
  { key: "phone", label: "Telefon" },
  { key: "email", label: "E-posta" },
  { key: "address", label: "Adres" },
  { key: "announcement", label: "Duyuru Metni" },
];

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s) => (map[s.key] = s.value));
        setSettings(map);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const { key } of settingsKeys) {
      if (settings[key] !== undefined) {
        await supabase.from("site_settings").update({ value: settings[key] }).eq("key", key);
      }
    }
    toast({ title: "Kaydedildi", description: "Site ayarları güncellendi." });
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Site Ayarları">
        <p className="text-muted-foreground font-body">Yükleniyor...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Ayarları">
      <div className="bg-card border border-border rounded p-6 max-w-2xl">
        <div className="space-y-4">
          {settingsKeys.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-muted-foreground font-body mb-1">{label}</label>
              <input
                value={settings[key] || ""}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 bg-foreground text-background px-6 py-2.5 text-sm font-body rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
