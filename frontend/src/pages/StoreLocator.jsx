import { useMemo, useState } from 'react';
import './StoreLocator.css';

const STORES = [
  {
    id: 1,
    name: 'PhoneHub - Cơ sở Trường ĐH Công nghệ Sài Gòn',
    system: 'PhoneHub Retail',
    address: '180 Cao Lỗ, Phường 4, Quận 8, TP. Hồ Chí Minh',
    hotline: '1800 2097',
    openHours: '08:00 - 22:00 (T2 - CN)',
    lat: 10.738822,
    lng: 106.677719,
    mapQuery: 'Trường Đại học Công nghệ Sài Gòn, 180 Cao Lỗ, Quận 8, TP.HCM',
  },
];

const StoreLocator = () => {
  const [search, setSearch] = useState('');

  const filteredStores = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return STORES;
    }

    return STORES.filter((store) => {
      const target = `${store.name} ${store.address} ${store.system}`.toLowerCase();
      return target.includes(keyword);
    });
  }, [search]);

  const activeStore = filteredStores[0] || STORES[0];
  const embedMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(activeStore.mapQuery)}&output=embed`;

  return (
    <main className="store-locator-page">
      <section className="store-locator-hero container">
        <h1>Hệ thống cửa hàng</h1>
        <p className="store-locator-description">
          Tìm cửa hàng gần bạn và xem chỉ đường nhanh. Hệ thống hiện đang hỗ trợ điểm bán tại
          Trường Đại học Công nghệ Sài Gòn.
        </p>
      </section>
        <br />
      <section className="container store-locator-content">
        <aside className="store-panel">
          <h3>Chọn cửa hàng</h3>
          <label htmlFor="store-search" className="store-search-label">Tìm kiếm cửa hàng</label>
          <input
            id="store-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nhập tên hoặc địa chỉ cửa hàng"
            className="store-search-input"
          />

          <div className="store-count">{filteredStores.length} cửa hàng phù hợp</div>

          {filteredStores.length === 0 ? (
            <div className="store-empty">
              Không tìm thấy cửa hàng phù hợp. Bạn thử tìm với từ khóa ngắn hơn nhé.
            </div>
          ) : (
            <div className="store-list" role="list">
              {filteredStores.map((store) => {
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.mapQuery)}`;

                return (
                  <article key={store.id} className="store-item" role="listitem">
                    <h4>{store.name}</h4>
                    <p><strong>Hệ thống:</strong> {store.system}</p>
                    <p><strong>Địa chỉ:</strong> {store.address}</p>
                    <p><strong>Giờ mở cửa:</strong> {store.openHours}</p>
                    <p><strong>Hotline:</strong> {store.hotline}</p>
                    <a href={directionsUrl} target="_blank" rel="noreferrer" className="store-directions-btn">
                      Xem đường đi
                    </a>
                  </article>
                );
              })}
            </div>
          )}
        </aside>

        <div className="store-map-panel">
          <div className="store-map-heading">Bản đồ vị trí cửa hàng</div>
          <iframe
            title="Bản đồ vị trí cửa hàng tại Trường Đại học Công nghệ Sài Gòn"
            src={embedMapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
};

export default StoreLocator;
