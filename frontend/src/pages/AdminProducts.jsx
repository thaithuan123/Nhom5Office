import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';
import './Products.css';

const initialForm = {
  name: '',
  brand: 'Apple',
  price: '',
  originalPrice: '',
  specs: '',
  rating: '4.5',
  reviews: '0',
  image: '📱',
  description: '',
  details: '',
  fullDescription: '',
  stock: '10',
};

const isImageSource = (value) => typeof value === 'string'
  && (/^https?:/i.test(value)
    || value.startsWith('/')
    || value.startsWith('./')
    || value.startsWith('data:image/'));

const loadImageFromFile = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(image);
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Không thể đọc ảnh đã chọn.'));
  };
  image.src = objectUrl;
});

const compressImageToDataUrl = async (file) => {
  const image = await loadImageFromFile(file);
  const outputSize = 900;
  const scale = Math.min(outputSize / image.width, outputSize / image.height);
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));
  const offsetX = Math.round((outputSize - targetWidth) / 2);
  const offsetY = Math.round((outputSize - targetHeight) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, outputSize, outputSize);
  context.drawImage(image, offsetX, offsetY, targetWidth, targetHeight);

  let quality = 0.84;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);

  while (dataUrl.length > 320000 && quality > 0.45) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  return dataUrl;
};

const parseApiResponse = async (response) => {
  const rawText = await response.text();

  try {
    return JSON.parse(rawText);
  } catch (err) {
    if (!response.ok && response.status === 413) {
      throw new Error('Ảnh quá lớn để lưu. Hãy chọn ảnh nhỏ hơn hoặc thử lại (hệ thống đã nén tự động).');
    }

    if (!response.ok) {
      throw new Error('Máy chủ trả về dữ liệu không hợp lệ. Vui lòng thử lại hoặc kiểm tra backend.');
    }
    throw err;
  }
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [imageUploadInfo, setImageUploadInfo] = useState('');
  const [imageUploadError, setImageUploadError] = useState('');
  const nameInputRef = useRef(null);
  const imageFileInputRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/products`);
      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tải danh sách sản phẩm');
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const brands = useMemo(() => ['all', ...new Set(products.map((product) => product.brand).filter(Boolean))], [products]);

  const visibleProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesKeyword = !keyword
        || product.name.toLowerCase().includes(keyword)
        || product.brand.toLowerCase().includes(keyword)
        || product.specs.toLowerCase().includes(keyword);

      const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
      return matchesKeyword && matchesBrand;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return b.stock - a.stock;
        default:
          return b.id - a.id;
      }
    });
  }, [products, searchTerm, brandFilter, sortBy]);

  const resetForm = () => {
    setForm(initialForm);
    setIsEditing(false);
    setEditingProductId(null);
    setImageUploadInfo('');
    setImageUploadError('');

    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageUploadError('');
    setImageUploadInfo('');

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Vui lòng chọn đúng file ảnh (jpg, png, webp, ...).');
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setImageUploadError('Ảnh gốc quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.');
      return;
    }

    compressImageToDataUrl(file)
      .then((compressedDataUrl) => {
        setForm((prev) => ({ ...prev, image: compressedDataUrl }));
        const estimatedKB = Math.round((compressedDataUrl.length * 0.75) / 1024);
        setImageUploadInfo(`Đã tải ảnh: ${file.name} (${estimatedKB} KB sau nén, tự canh khung vuông)`);
      })
      .catch(() => {
        setImageUploadError('Không xử lý được ảnh. Vui lòng chọn ảnh khác.');
      });
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: '📱' }));
    setImageUploadInfo('Đã xóa ảnh hiện tại.');
    setImageUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        rating: Number(form.rating || 4.5),
        reviews: Number(form.reviews || 0),
        stock: Number(form.stock || 0),
      };

      const url = isEditing ? `${API_BASE}/api/products/${editingProductId}` : `${API_BASE}/api/products`;
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await parseApiResponse(response);
      if (!response.ok) {
        throw new Error(data.error || 'Không thể lưu sản phẩm');
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      brand: product.brand || 'Apple',
      price: String(product.price ?? ''),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      specs: product.specs || '',
      rating: String(product.rating ?? 4.5),
      reviews: String(product.reviews ?? 0),
      image: product.image || '📱',
      description: product.description || '',
      details: product.details || '',
      fullDescription: product.fullDescription || '',
      stock: String(product.stock ?? 0),
    });
    setIsEditing(true);
    setEditingProductId(product.id);
    setImageUploadInfo('');
    setImageUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }, 150);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' });
      const data = await parseApiResponse(response);
      if (!response.ok) {
        throw new Error(data.error || 'Không thể xóa sản phẩm');
      }
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="products-admin-page">
      <div className="container">
        <div className="page-heading">
          <div>
            <h1>Quản lý sản phẩm</h1>
            <p>Thêm, sửa, xóa và quản lý danh mục điện thoại trong hệ thống PhoneHub.</p>
          </div>
          <Link className="btn btn-secondary" to="/admin">
            Về menu admin
          </Link>
        </div>

        <div className="products-overview">
          <div className="overview-card"><span>Tổng sản phẩm</span><strong>{products.length}</strong></div>
          <div className="overview-card"><span>Hiển thị sau lọc</span><strong>{visibleProducts.length}</strong></div>
          <div className="overview-card"><span>Tồn kho toàn hệ thống</span><strong>{products.reduce((sum, product) => sum + Number(product.stock || 0), 0)}</strong></div>
        </div>

        <section className="product-form-section">
          <h2>{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="input-group"><label>Tên sản phẩm</label><input ref={nameInputRef} name="name" value={form.name} onChange={handleInputChange} required /></div>
            <div className="input-group"><label>Hãng</label><select name="brand" value={form.brand} onChange={handleInputChange}><option value="Apple">Apple</option><option value="Samsung">Samsung</option><option value="Xiaomi">Xiaomi</option><option value="OPPO">OPPO</option><option value="Vivo">Vivo</option><option value="Realme">Realme</option></select></div>
            <div className="input-group"><label>Giá bán</label><input type="number" name="price" value={form.price} onChange={handleInputChange} required min="0" /></div>
            <div className="input-group"><label>Giá gốc</label><input type="number" name="originalPrice" value={form.originalPrice} onChange={handleInputChange} min="0" /></div>
            <div className="input-group"><label>Thông số ngắn</label><input name="specs" value={form.specs} onChange={handleInputChange} required /></div>
            <div className="input-group"><label>Tồn kho</label><input type="number" name="stock" value={form.stock} onChange={handleInputChange} min="0" required /></div>
            <div className="input-group"><label>Đánh giá</label><input type="number" step="0.1" min="0" max="5" name="rating" value={form.rating} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Số lượt đánh giá</label><input type="number" min="0" name="reviews" value={form.reviews} onChange={handleInputChange} /></div>
            <div className="input-group full-width">
              <label>Ảnh sản phẩm</label>
              <div className="admin-image-upload">
                <div className="admin-image-preview">
                  {isImageSource(form.image)
                    ? <img src={form.image} alt="Xem trước ảnh sản phẩm" />
                    : <span>{form.image || '📱'}</span>}
                </div>
                <div className="admin-image-controls">
                  <input ref={imageFileInputRef} type="file" accept="image/*" onChange={handleImageFileChange} />
                  <small>Chọn ảnh từ máy, hệ thống sẽ tự xử lý và lưu.</small>
                  <input
                    name="image"
                    value={isImageSource(form.image) && form.image.startsWith('data:image/') ? '' : form.image}
                    onChange={handleInputChange}
                    placeholder="Hoặc dán link ảnh: https://..."
                  />
                  <button className="btn btn-secondary small" type="button" onClick={clearImage}>
                    Xóa ảnh
                  </button>
                  {imageUploadInfo && <small className="image-upload-info">{imageUploadInfo}</small>}
                  {imageUploadError && <small className="error-text">{imageUploadError}</small>}
                </div>
              </div>
            </div>
            <div className="input-group full-width"><label>Mô tả ngắn</label><textarea name="description" value={form.description} onChange={handleInputChange} required rows="2" /></div>
            <div className="input-group full-width"><label>Chi tiết kỹ thuật</label><textarea name="details" value={form.details} onChange={handleInputChange} required rows="2" /></div>
            <div className="input-group full-width"><label>Mô tả đầy đủ</label><textarea name="fullDescription" value={form.fullDescription} onChange={handleInputChange} rows="4" /></div>
            <div className="action-buttons full-width">
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>Làm mới</button>
            </div>
          </form>
        </section>

        <section className="product-filter-section">
          <div className="filter-item search-item"><label>Tìm kiếm</label><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo tên, hãng, thông số..." /></div>
          <div className="filter-item"><label>Lọc hãng</label><select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>{brands.map((brand) => <option key={brand} value={brand}>{brand === 'all' ? 'Tất cả' : brand}</option>)}</select></div>
          <div className="filter-item"><label>Sắp xếp</label><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="newest">Mới nhất</option><option value="price-low">Giá thấp → cao</option><option value="price-high">Giá cao → thấp</option><option value="rating">Đánh giá cao</option><option value="stock">Tồn kho nhiều</option></select></div>
        </section>

        {loading && <p>Đang tải danh sách sản phẩm...</p>}
        {error && <p className="error-text">Lỗi: {error}</p>}

        {!loading && (
          <div className="products-table-wrap">
            <table className="products-table">
              <thead>
                <tr><th>#</th><th>Sản phẩm</th><th>Hãng</th><th>Giá</th><th>Tồn kho</th><th>Đánh giá</th><th>Hành động</th></tr>
              </thead>
              <tbody>
                {visibleProducts.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center' }}>Không có sản phẩm phù hợp.</td></tr>
                ) : visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <div className="product-cell">
                        <span className="product-thumb">
                          {isImageSource(product.image)
                            ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                            : (product.image || '📱')}
                        </span>
                        <div>
                          <button type="button" className="product-name-button" onClick={() => handleEdit(product)} title="Bấm để chỉnh sửa sản phẩm này">
                            {product.name}
                          </button>
                          <p>{product.specs}</p>
                        </div>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td>{Number(product.price).toLocaleString('vi-VN')} ₫</td>
                    <td>{product.stock}</td>
                    <td>{product.rating} ⭐</td>
                    <td><div className="table-actions"><Link className="btn btn-secondary small" to={`/product/${product.id}`}>Xem</Link><button className="btn btn-secondary small" onClick={() => handleEdit(product)}>Sửa</button><button className="btn btn-danger small" onClick={() => handleDelete(product.id)}>Xóa</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminProducts;
