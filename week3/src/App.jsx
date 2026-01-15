import { useState, useEffect } from 'react';
import { apiLogin, apiCheckLogin } from './apis/admin/auth';
import { apiGetProducts } from './apis/admin/product';

const LoginView = ({ setIsAuth }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiLogin(formData);
      const { token, expired } = res.data;
      document.cookie = `adminToken=${token}; expires=${new Date(expired).toUTCString()}`;
      setIsAuth(true);
    } catch (error) {
      console.error(error.response?.data?.message || '登入失敗');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col" style={{ maxWidth: '440px' }}>
          <h1 className="h2 text-center mb-4">請先登入</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-4">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoFocus
                  autoComplete="username"
                />
                <label htmlFor="username">Email</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <button type="submit" className="btn btn-lg btn-primary w-100">
              登入
            </button>
          </form>
          <p className="text-muted text-center py-4">
            &copy; 2024 - {new Date().getFullYear()}．六角學院
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductList = ({ products, setTempProduct }) => {
  return (
    <table className="table align-middle">
      <thead>
        <tr>
          <th>產品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>查看細節</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.origin_price}</td>
              <td>{product.price}</td>
              <td>
                {product.is_enabled ? (
                  <span className="text-success">是</span>
                ) : (
                  <span className="text-secondary">否</span>
                )}
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setTempProduct(product)}
                >
                  查看細節
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-muted text-center">
              尚無商品資料
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const ProductDetailCard = ({ product }) => {
  const [mainImageUrl, setMainImageUrl] = useState(product.imageUrl);

  useEffect(() => {
    setMainImageUrl(product.imageUrl);
  }, [product]);

  return (
    <div className="card">
      <img
        src={mainImageUrl}
        alt={product.title}
        className="card-img-top"
        style={{
          height: '360px',
          objectFit: 'cover',
        }}
      />
      <div className="card-body">
        <div className="mb-3">
          <h3 className="card-title d-flex align-items-center mb-0">
            {product.title}
            <span className="badge fs-6 bg-primary ms-2">{product.category}</span>
          </h3>
          <p className="card-text">
            {product.price} 元 / <del className="text-secondary">{product.origin_price} 元</del>
          </p>
        </div>

        <h4 className="fs-6 fw-bold">商品描述</h4>
        <p className="card-text">{product.description}</p>

        <h4 className="fs-6 fw-bold">商品內容</h4>
        <p className="card-text">{product.content}</p>

        <h4 className="fs-6 fw-bold">更多圖片</h4>
        <div className="row row-cols-3 g-2">
          {[product.imageUrl, ...product.imagesUrl].map((url, index) => (
            <div key={url} className="col">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMainImageUrl(url);
                }}
              >
                <img
                  src={url}
                  alt={`${product.title} ${index + 1}`}
                  className="w-100"
                  style={{
                    height: '150px',
                    objectFit: 'cover',
                  }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminView = () => {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const getProducts = async () => {
    try {
      const res = await apiGetProducts();
      setProducts(res.data.products);
    } catch (error) {
      console.error(error.response?.data?.message || '取得產品資料失敗');
    }
  };

  useEffect(() => {
    (async () => {
      await getProducts();
    })();
  }, []);

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>產品列表</h2>
          <ProductList products={products} setTempProduct={setTempProduct} />
        </div>

        <div className="col-md-6">
          <h2>單一產品細節</h2>
          {tempProduct ? (
            <ProductDetailCard product={tempProduct} />
          ) : (
            <p className="text-secondary">請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const checkLogin = async () => {
    try {
      await apiCheckLogin();
      setIsAuth(true);
    } catch (error) {
      console.error(error.response?.data?.message || '驗證失敗');
    }
  };

  useEffect(() => {
    (async () => {
      await checkLogin();
    })();
  }, []);

  return <>{isAuth ? <AdminView /> : <LoginView setIsAuth={setIsAuth} />}</>;
};

export default App;
