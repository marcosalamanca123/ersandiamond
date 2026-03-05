import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload, X, Pencil } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type ProductImage = Tables<"product_images">;

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<(Product & { images: ProductImage[] })[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", brand: "", price: "", category: "", description: "", is_featured: false });
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    const { data: prods } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!prods) return;

    const { data: images } = await supabase.from("product_images").select("*");

    const combined = prods.map((p) => ({
      ...p,
      images: (images || []).filter((img) => img.product_id === p.id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    }));

    setProducts(combined);
    setLoading(false);
  };

  const fetchBrands = async () => {
    const { data } = await supabase.from("brands").select("id, name").order("name");
    if (data) setBrands(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const resetForm = () => {
    setForm({ name: "", brand: "", price: "", category: "", description: "", is_featured: false });
    setPendingImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      brand: form.brand,
      price: parseFloat(form.price) || 0,
      category: form.category,
      description: form.description,
      is_featured: form.is_featured,
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Hata", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Başarılı", description: "Ürün güncellendi." });
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error) {
        toast({ title: "Hata", description: error.message, variant: "destructive" });
        return;
      }
      // Upload pending images for new product
      if (data && pendingImages.length > 0) {
        await handleImageUpload(data.id, pendingImages);
      }
      toast({ title: "Başarılı", description: "Ürün eklendi." });
    }

    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Silindi", description: "Ürün silindi." });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      is_featured: product.is_featured || false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleImageUpload = async (productId: string, files: FileList | File[]) => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const filePath = `${productId}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
      if (uploadError) {
        toast({ title: "Yükleme Hatası", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(filePath);

      await supabase.from("product_images").insert({
        product_id: productId,
        image_url: publicUrl.publicUrl,
        sort_order: i,
      });
    }
    setUploading(false);
    toast({ title: "Başarılı", description: "Görseller yüklendi." });
    fetchProducts();
  };

  const handleDeleteImage = async (imageId: string) => {
    await supabase.from("product_images").delete().eq("id", imageId);
    fetchProducts();
  };

  return (
    <AdminLayout title="Ürün Yönetimi">
      <div className="mb-4">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-body rounded hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-foreground">
              {editingId ? "Ürün Düzenle" : "Yeni Ürün"}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Ürün Adı</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Marka</label>
              <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" required>
                <option value="">Seçiniz</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Fiyat (₺)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground font-body mb-1">Kategori</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" required>
                <option value="">Seçiniz</option>
                <option value="Saatler">Saatler</option>
                <option value="Çantalar">Çantalar</option>
                <option value="Mücevher">Mücevher</option>
                <option value="Marka Mücevher">Marka Mücevher</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground font-body mb-1">Açıklama</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            {!editingId && (
              <div className="md:col-span-2">
                <label className="block text-xs text-muted-foreground font-body mb-1">Görseller</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {pendingImages.map((file, i) => (
                    <div key={i} className="relative group w-16 h-16 rounded overflow-hidden border border-border">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPendingImages(pendingImages.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-foreground/50 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 rounded border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setPendingImages([...pendingImages, ...Array.from(e.target.files)]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="rounded border-border" id="featured" />
              <label htmlFor="featured" className="text-sm text-foreground font-body">Öne Çıkan Ürün</label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-foreground text-background px-6 py-2 text-sm font-body rounded hover:opacity-90 transition-opacity">
                {editingId ? "Güncelle" : "Kaydet"}
              </button>
              <button type="button" onClick={resetForm} className="border border-border px-6 py-2 text-sm font-body rounded text-foreground hover:bg-muted transition-colors">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <p className="text-muted-foreground font-body">Yükleniyor...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-12">Henüz ürün eklenmemiş.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body font-medium text-foreground">{product.name}</h3>
                    {product.is_featured && (
                      <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded font-body">ÖNE ÇIKAN</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-body">
                    {product.brand} · {product.category} · ₺{product.price.toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(product)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Images */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {product.images.map((img) => (
                  <div key={img.id} className="relative group w-16 h-16 rounded overflow-hidden border border-border">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute inset-0 bg-foreground/50 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="w-16 h-16 rounded border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(product.id, e.target.files)}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
