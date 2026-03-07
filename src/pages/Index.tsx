import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HeroSlider from "@/components/HeroSlider";
import HeroCategories from "@/components/HeroCategories";
import PopularCategories from "@/components/PopularCategories";
import BrandsSection from "@/components/BrandsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <HeroSlider />
        <HeroCategories />
        <PopularCategories />
        <BrandsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
