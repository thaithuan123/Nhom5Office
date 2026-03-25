import ProductList from '../components/ProductList';
import './Home.css';

const Home = () => {
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 35900000,
      originalPrice: 39990000,
      specs: '6.7" AMOLED | A17 Pro | 256GB',
      rating: 4.8,
      reviews: 245,
      image: '📱',
      description: 'Flagship iPhone mới nhất với công nghệ camera tiên tiến',
      details: 'Màn hình AMOLED 6.7 inch, Chip A17 Pro, Camera 48MP, Pin 4685mAh, 5G, Titanium'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 32990000,
      originalPrice: 36990000,
      specs: '6.8" Dynamic AMOLED | Snapdragon 8 Gen 3',
      rating: 4.7,
      reviews: 189,
      image: '📱',
      description: 'Điện thoại flagship của Samsung với hiệu năng cực mạnh',
      details: 'Màn hình Dynamic AMOLED 120Hz, Snapdragon 8 Gen 3, Camera 50MP, 5000mAh, S Pen'
    },
    {
      id: 3,
      name: 'Xiaomi 14 Ultra',
      brand: 'Xiaomi',
      price: 19990000,
      originalPrice: 22990000,
      specs: '6.73" AMOLED | Snapdragon 8 Gen 3',
      rating: 4.6,
      reviews: 156,
      image: '📱',
      description: 'Giá tốt nhất cho flagship performance',
      details: 'Màn hình AMOLED 120Hz, Snapdragon 8 Gen 3, Camera Leica 50MP, 5000mAh'
    },
    {
      id: 4,
      name: 'OPPO Find X6 Pro',
      brand: 'OPPO',
      price: 21990000,
      specs: '6.82" AMOLED | Snapdragon 8 Gen 3',
      rating: 4.5,
      reviews: 98,
      image: '📱',
      description: 'Thiết kế đẹp với công nghệ sạc nhanh',
      details: 'Màn hình AMOLED 120Hz, Snapdragon 8 Gen 3, Sạc 100W, Camera 50MP'
    },
    {
      id: 5,
      name: 'iPhone 15',
      brand: 'Apple',
      price: 26900000,
      originalPrice: 29990000,
      specs: '6.1" Super Retina | A16 Bionic',
      rating: 4.7,
      reviews: 312,
      image: '📱',
      description: 'iPhone tiêu chuẩn với hiệu năng mạnh mẽ',
      details: 'Màn hình 6.1 inch, A16 Bionic, Camera 48MP, 5G'
    },
    {
      id: 6,
      name: 'Samsung Galaxy A54',
      brand: 'Samsung',
      price: 12990000,
      specs: '6.4" Super AMOLED | Exynos 1380',
      rating: 4.4,
      reviews: 267,
      image: '📱',
      description: 'Smartphone tầm trung tốt nhất hiện nay',
      details: 'Màn hình Super AMOLED 120Hz, Exynos 1380, Camera 50MP, Pin 5000mAh'
    },
  ];

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Chào mừng đến PhoneHub</h1>
          <p>Nơi mua bán điện thoại di động chất lượng cao &amp; giá tốt nhất</p>
          <button className="btn btn-primary">Khám phá ngay</button>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <h3>Giao hàng nhanh</h3>
            <p>Giao hàng trong 24h tại TP.HCM</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <h3>Giá tốt nhất</h3>
            <p>Giảm giá tối đa cho tất cả sản phẩm</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <h3>Bảo hành chính hãng</h3>
            <p>Bảo hành 12-24 tháng từ hãng</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <h3>Hỗ trợ 24/7</h3>
            <p>Chăm sóc khách hàng tuyệt vời</p>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <h2>Sản phẩm nổi bật</h2>
          <ProductList products={products} />
        </div>
      </section>
    </main>
  );
};

export default Home;
