import { useEffect, useState } from 'react';

export default function App() {
  const [cart, setCart] = useState([]);
  const products = [
    { id: 'p1', name: 'Premium Watch', price: 199, emoji: '⌚' },
    { id: 'p2', name: 'Designer Bag', price: 85, emoji: '👜' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const items = params.get('items');
    if (items) {
      const ids = items.split(',');
      setCart(products.filter(p => ids.includes(p.id)));
    }
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Sahar AI Shop (Vercel Test)</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
            <div style={{ fontSize: '40px' }}>{p.emoji}</div>
            <h3>{p.name}</h3>
            <p>{p.price}€</p>
            <button onClick={() => setCart([...cart, p])}>Add Manual</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h2>Your Cart: {cart.length} items</h2>
        {cart.map((item, i) => <div key={i}>{item.name} ({item.price}€)</div>)}
        <button style={{ marginTop: '10px', background: 'black', color: 'white', padding: '10px 20px' }}>
          Checkout: {cart.reduce((s, i) => s + i.price, 0)}€
        </button>
      </div>
    </div>
  );
}