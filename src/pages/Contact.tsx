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

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Hata", description: "Lütfen zorunlu alanları doldurun.", variant: "destructive" });
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
      toast({ title: "Hata", description: "Mesaj gönderilemedi. Lütfen tekrar deneyin.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Mesajınız başarıyla gönderildi." });
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
          <h1 className="font-display text-2xl md:text-3xl text-foreground text-center mb-2">Bize Ulaşın</h1>
          <p className="text-sm text-muted-foreground font-body text-center mb-8">
            Sorularınız veya talepleriniz için formu doldurun, en kısa sürede size dönüş yapalım.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">Ad Soyad *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Adınız ve soyadınız"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">E-posta *</label>
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
              <label className="text-sm font-body text-foreground mb-1 block">Telefon</label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+90 5XX XXX XX XX"
                maxLength={20}
              />
            </div>
            <div>
              <label className="text-sm font-body text-foreground mb-1 block">Mesajınız *</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Mesajınızı buraya yazın..."
                rows={5}
                maxLength={1000}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
