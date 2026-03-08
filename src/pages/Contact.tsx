import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: t("contact.error_title"), description: t("contact.error_required"), variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: t("contact.error_title"), description: t("contact.error_send"), variant: "destructive" });
    } else {
      toast({ title: t("contact.success_title"), description: t("contact.success_msg") });
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <TopBar />
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 max-w-xl">
          <h1 className="font-display text-2xl md:text-3xl text-foreground text-center mb-2">{t("contact.title")}</h1>
          <p className="text-sm text-muted-foreground font-body text-center mb-8">
            {t("contact.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">{t("contact.name")}</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("contact.name_placeholder")}
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">{t("contact.email")}</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ornek@email.com"
                maxLength={255}
                required
              />
            </div>
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">{t("contact.phone")}</label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+90 5XX XXX XX XX"
                maxLength={20}
              />
            </div>
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">{t("contact.message")}</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t("contact.message_placeholder")}
                rows={5}
                maxLength={1000}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? t("contact.sending") : t("contact.send")}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
