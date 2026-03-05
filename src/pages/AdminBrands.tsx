import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, X, Pencil, Image } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  created_at: string;
}

const AdminBrands = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", sort_order: "0" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    const { data } = await supabase.from("brands").select("*").order("sort_order", { ascending: true });
    if (data) setBrands(data);
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", sort_order: "0" });
    setEditingId(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (brandId: string, file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const filePath = `brands/${brandId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file);
    if (error) {
      toast({ title: "Yükleme Hatası", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: any = {
      name: form.name,
      description: form.description || null,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (editingId) {
      if (imageFile) {
        const url = await uploadImage(editingId, imageFile);
        if (url) payload.image_url = url;
      }
      const { error } = await supabase.from("brands").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      toast({ title: "Başarılı", description: "Marka güncellendi." });
    } else {
      const { data, error } = await supabase.from("brands").insert(payload).select().single();
      if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); setSaving(false); return; }
      if (imageFile && data) {
        const url = await uploadImage(data.id, imageFile);
        if (url) await supabase.from("brands").update({ image_url: url }).eq("id", data.id);
      }
      toast({ title: "Başarılı", description: "Marka eklendi." });
    }
    setSaving(false);
    resetForm();
    fetchBrands();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Silindi", description: "Marka silindi." });
    fetchBrands();
  };

  const handleEdit = (brand: Brand) => {
    setForm({ name: brand.name, description: brand.description || "", sort_order: (brand.sort_order || 0).toString() });
    setEditingId(brand.id);
    setImagePreview(brand.image_url);
    setImageFile(null);
    setShowForm(true);
  };

  return (
    <AdminLayout title="Marka Yönetimi">
      <div className="mb-4">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-body rounded hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Yeni Marka Ekle
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-foreground">
              {editingId ? "Marka Düzenle" : "Yeni Marka"}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Marka Adı</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Sıralama</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground font-body mb-1">Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground font-body mb-1">Marka Görseli</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-border">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted border border-dashed border-border flex items-center justify-center">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <label className="cursor-pointer bg-muted hover:bg-accent text-foreground px-4 py-2 text-sm font-body rounded border border-border transition-colors">
                  Görsel Seç
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={saving}
                className="bg-foreground text-background px-6 py-2 text-sm font-body rounded hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kaydet"}
              </button>
              <button type="button" onClick={resetForm} className="border border-border px-6 py-2 text-sm font-body rounded text-foreground hover:bg-muted transition-colors">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground font-body">Yükleniyor...</p>
      ) : brands.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-12">Henüz marka eklenmemiş.</p>
      ) : (
        <div className="space-y-4">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-card border border-border rounded p-4">
              <div className="flex items-center gap-4">
                {brand.image_url ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-border flex-shrink-0">
                    <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted border border-border flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-body">Görsel Yok</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-medium text-foreground">{brand.name}</h3>
                  {brand.description && (
                    <p className="text-sm text-muted-foreground font-body line-clamp-1">{brand.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground font-body">Sıra: {brand.sort_order}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(brand)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(brand.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBrands;
