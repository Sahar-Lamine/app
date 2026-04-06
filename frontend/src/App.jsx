import { useEffect, useState } from 'react';

const API_URL = "http://localhost:3000"; // URL de ton serveur Node

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // 1. Charger les produits depuis le Backend
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        
        // 2. Vérifier si l'IA a envoyé des produits via l'URL
        const params = new URLSearchParams(window.location.search);
        const items = params.get('items');
        if (items) {
          const ids = items.split(',');
          const aiSelected = data.filter(p => ids.includes(p.id));
          setCart(aiSelected);
        }
      });
  }, []);

  const addToCart = (product) => setCart([...cart, product]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Ma Boutique (React + AI)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <section>
          <h2>Produits disponibles</h2>
          {products.map(p => (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              <span>{p.image} {p.name} - <b>{p.price}€</b></span>
              <button onClick={() => addToCart(p)} style={{ float: 'right' }}>Ajouter</button>
            </div>
          ))}
        </section>

        <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
          <h2>🛒 Panier ({cart.length})</h2>
          {cart.map((item, i) => <div key={i} style={{ fontSize: '14px' }}>- {item.name} ({item.price}€)</div>)}
          <hr />
          <h3>Total : {total}€</h3>
          <button disabled={cart.length === 0} style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Payer maintenant
          </button>
        </section>
      </div>
    </div>
  );
}