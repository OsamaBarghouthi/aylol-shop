import { useState, useMemo, useEffect, useRef } from "react";
import {
  ShoppingBag, X, Plus, Minus, ChevronLeft, Check, Sparkles, ArrowRight,
  Settings, Trash2, Upload, Link as LinkIcon, Tag, Lock, Pencil, Save, PlusCircle
} from "lucide-react";

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];
const EDIT_CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Accessories"];
const SIZES = ["XS", "S", "M", "L", "XL"];
const ADMIN_PASSWORD = "aylol2026";
const STORAGE_KEY = "aylol-products";

const GRADIENTS = [
  "from-pink-500 to-orange-400", "from-violet-500 to-fuchsia-400", "from-blue-500 to-cyan-400",
  "from-emerald-500 to-lime-400", "from-orange-500 to-yellow-400", "from-fuchsia-500 to-pink-400",
  "from-indigo-500 to-purple-400", "from-rose-500 to-red-400", "from-teal-500 to-emerald-400",
  "from-amber-500 to-orange-400", "from-purple-500 to-indigo-400", "from-cyan-500 to-blue-400",
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Solar Flare Tee", category: "Tops", price: 34, grad: GRADIENTS[0], colors: ["#f472b6", "#fb923c", "#facc15"], image: null, discountType: null, discountValue: 0 },
  { id: 2, name: "Neon Pulse Hoodie", category: "Outerwear", price: 68, grad: GRADIENTS[1], colors: ["#a78bfa", "#f472b6"], image: null, discountType: null, discountValue: 0 },
  { id: 3, name: "Electric Wave Joggers", category: "Bottoms", price: 52, grad: GRADIENTS[2], colors: ["#3b82f6", "#22d3ee"], image: null, discountType: null, discountValue: 0 },
  { id: 4, name: "Citrus Crush Crop Top", category: "Tops", price: 28, grad: GRADIENTS[4], colors: ["#f97316", "#facc15"], image: null, discountType: null, discountValue: 0 },
  { id: 5, name: "Tropic Bloom Shorts", category: "Bottoms", price: 36, grad: GRADIENTS[5], colors: ["#d946ef", "#f472b6"], image: null, discountType: null, discountValue: 0 },
  { id: 6, name: "Cosmic Drip Jacket", category: "Outerwear", price: 89, grad: GRADIENTS[6], colors: ["#6366f1", "#a855f7"], image: null, discountType: null, discountValue: 0 },
  { id: 7, name: "Mango Pop Cap", category: "Accessories", price: 22, grad: GRADIENTS[9], colors: ["#f59e0b", "#fb923c"], image: null, discountType: null, discountValue: 0 },
  { id: 8, name: "Berry Static Tee", category: "Tops", price: 32, grad: GRADIENTS[7], colors: ["#f43f5e", "#ef4444"], image: null, discountType: null, discountValue: 0 },
  { id: 9, name: "Lagoon Glow Sweatpants", category: "Bottoms", price: 48, grad: GRADIENTS[8], colors: ["#14b8a6", "#34d399"], image: null, discountType: null, discountValue: 0 },
  { id: 10, name: "Prism Shades", category: "Accessories", price: 18, grad: GRADIENTS[10], colors: ["#a855f7", "#6366f1"], image: null, discountType: null, discountValue: 0 },
  { id: 11, name: "Sunset Ripple Tank", category: "Tops", price: 26, grad: GRADIENTS[4], colors: ["#fb923c", "#facc15"], image: null, discountType: null, discountValue: 0 },
  { id: 12, name: "Voltage Bomber", category: "Outerwear", price: 76, grad: GRADIENTS[11], colors: ["#06b6d4", "#3b82f6"], image: null, discountType: null, discountValue: 0 },
];

function finalPrice(p) {
  if (!p.discountType || !p.discountValue) return p.price;
  if (p.discountType === "percent") return Math.max(0, p.price * (1 - p.discountValue / 100));
  if (p.discountType === "fixed") return Math.max(0, p.price - p.discountValue);
  return p.price;
}

function ProductMedia({ product, className }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className={`object-cover ${className}`} />;
  }
  return <div className={`bg-gradient-to-br ${product.grad} ${className}`} />;
}

function DiscountBadge({ product }) {
  if (!product.discountType || !product.discountValue) return null;
  const label = product.discountType === "percent" ? `-${product.discountValue}%` : `-$${product.discountValue}`;
  return (
    <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold shadow">
      {label}
    </span>
  );
}

function ProductCard({ product, onClick, index }) {
  const discounted = finalPrice(product) < product.price;
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={() => onClick(product)}
      style={{ transitionDelay: visible ? `${(index % 8) * 60}ms` : "0ms" }}
      className={`group text-left rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border border-slate-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="aspect-square relative overflow-hidden">
        <ProductMedia product={product} className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {!product.image && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {product.colors.map((c, i) => (
              <span
                key={i}
                style={{ backgroundColor: c, transitionDelay: `${i * 50}ms` }}
                className="w-3.5 h-3.5 rounded-full border-2 border-white/80 shadow transition-transform duration-300 group-hover:scale-125"
              />
            ))}
          </div>
        )}
        <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 text-[10px] font-bold tracking-wide text-slate-700 uppercase transition-transform duration-300 group-hover:scale-105">
          {product.category}
        </span>
        <DiscountBadge product={product} />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 transition-colors duration-300 group-hover:text-fuchsia-600">{product.name}</h3>
        {discounted ? (
          <div className="flex items-center gap-2">
            <p className="text-fuchsia-600 font-bold">${finalPrice(product).toFixed(2)}</p>
            <p className="text-slate-400 text-xs line-through">${product.price}</p>
          </div>
        ) : (
          <p className="text-fuchsia-600 font-bold">${product.price}</p>
        )}
      </div>
    </button>
  );
}

function ProductModal({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;
  const price = finalPrice(product);

  function handleAdd() {
    onAddToCart({ ...product, price, size, qty });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 700);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl grid grid-cols-1 sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-square sm:aspect-auto relative">
          <ProductMedia product={product} className="absolute inset-0 w-full h-full" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors sm:hidden">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 relative">
          <button onClick={onClose} className="hidden sm:flex absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={16} />
          </button>
          <span className="text-xs font-bold tracking-wide text-fuchsia-500 uppercase">{product.category}</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1 mb-2">{product.name}</h2>
          {price < product.price ? (
            <div className="flex items-center gap-2 mb-4">
              <p className="text-2xl font-bold text-fuchsia-600">${price.toFixed(2)}</p>
              <p className="text-slate-400 line-through">${product.price}</p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-fuchsia-600 mb-4">${product.price}</p>
          )}
          <p className="text-sm text-slate-500 mb-5">Bold colors, soft fabric, made to stand out. A statement piece for everyday energy.</p>

          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Size</p>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`w-10 h-10 rounded-lg text-sm font-semibold border-2 transition-colors ${size === s ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 transition-colors">
                <Minus size={14} />
              </button>
              <span className="font-semibold w-6 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-lg border-2 border-slate-200 flex items-center justify-center hover:border-slate-400 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button onClick={handleAdd} disabled={added} className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${added ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white hover:shadow-lg hover:shadow-fuchsia-200"}`}>
            {added ? (<><Check size={18} /> Added!</>) : (<><ShoppingBag size={18} /> Add to Cart</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, items, onUpdateQty, onRemove, onCheckout }) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-lg flex items-center gap-2"><ShoppingBag size={18} /> Your Cart</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              <ShoppingBag size={32} className="mx-auto mb-3 text-slate-200" />
              Your cart is empty
            </div>
          )}
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden relative">
                <ProductMedia product={item} className="absolute inset-0 w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{item.name}</p>
                <p className="text-xs text-slate-400 mb-1">Size {item.size}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQty(idx, Math.max(1, item.qty - 1))} className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center hover:border-slate-400"><Minus size={10} /></button>
                    <span className="text-xs font-medium w-4 text-center">{item.qty}</span>
                    <button onClick={() => onUpdateQty(idx, item.qty + 1)} className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center hover:border-slate-400"><Plus size={10} /></button>
                  </div>
                  <span className="font-bold text-fuchsia-600 text-sm">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => onRemove(idx)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100">
            <div className="flex justify-between mb-4">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2">
              Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutPage({ items, onBack, onPlaceOrder }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "" });
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 6 : 0;
  const total = subtotal + shipping;
  function update(field, val) { setForm((f) => ({ ...f, [field]: val })); }
  const valid = form.name && form.email && form.address && form.city && form.zip;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-6 text-sm font-medium">
        <ChevronLeft size={16} /> Back to shop
      </button>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
        <div className="sm:col-span-3 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Full Name</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-fuchsia-400" placeholder="Jordan Lee" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-fuchsia-400" placeholder="jordan@email.com" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Address</label>
              <input value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-fuchsia-400" placeholder="123 Color St" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">City</label>
              <input value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-fuchsia-400" placeholder="Ramallah" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">ZIP</label>
              <input value={form.zip} onChange={(e) => update("zip", e.target.value)} className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-fuchsia-400" placeholder="00000" />
            </div>
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="bg-slate-50 rounded-2xl p-5 sticky top-4">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate pr-2">{item.name} ({item.size}) x{item.qty}</span>
                  <span className="font-medium flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>Shipping</span><span>${shipping}</span></div>
              <div className="flex justify-between font-bold text-lg pt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <button onClick={() => valid && onPlaceOrder(form, total)} disabled={!valid} className="w-full mt-5 py-3 rounded-xl font-bold bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationPage({ orderNum, total, onContinue }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400 flex items-center justify-center mx-auto mb-5">
        <Check size={28} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-slate-500 mb-1">Thanks for shopping with Aylol.</p>
      <p className="text-slate-400 text-sm mb-6">Order <span className="font-mono font-semibold text-slate-600">#{orderNum}</span> · Total ${total.toFixed(2)}</p>
      <button onClick={onContinue} className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors">
        Continue Shopping
      </button>
    </div>
  );
}

// ---------- ADMIN ----------

function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  function submit() {
    if (pw === ADMIN_PASSWORD) onLogin();
    else setError("Incorrect password.");
  }
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4 mx-auto">
          <Lock size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-center mb-1">Admin Access</h1>
        <p className="text-slate-400 text-sm text-center mb-6">Enter the admin password to manage Aylol.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-fuchsia-400 mb-2"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <button onClick={submit} className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white hover:shadow-lg transition-all mt-2">
          Enter
        </button>
      </div>
    </div>
  );
}

function ImagePicker({ value, onChange }) {
  const fileRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Product Photo</p>
      <div className="flex gap-3 items-start">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Upload size={20} />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-slate-200 text-xs font-semibold text-slate-600 hover:border-slate-400 transition-colors"
          >
            <Upload size={12} /> Upload from device
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <div className="flex gap-1.5">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image URL"
              className="flex-1 px-2.5 py-1.5 border-2 border-slate-200 rounded-lg text-xs focus:outline-none focus:border-fuchsia-400"
            />
            <button
              type="button"
              onClick={() => urlInput.trim() && onChange(urlInput.trim())}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white"
            >
              <LinkIcon size={12} />
            </button>
          </div>
          {value && (
            <button type="button" onClick={() => onChange(null)} className="text-xs text-red-500 font-medium">
              Remove photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductEditForm({ product, onSave, onCancel }) {
  const isNew = !product;
  const [form, setForm] = useState(
    product || {
      id: null,
      name: "",
      category: "Tops",
      price: "",
      grad: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      colors: ["#f472b6", "#fb923c"],
      image: null,
      discountType: null,
      discountValue: 0,
    }
  );

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, price: parseFloat(form.price), discountValue: parseFloat(form.discountValue) || 0 });
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-fuchsia-200 p-5 space-y-4">
      <h3 className="font-bold text-slate-800">{isNew ? "Add New Product" : `Edit: ${product.name}`}</h3>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-fuchsia-400" placeholder="Product name" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Category</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-fuchsia-400 bg-white">
            {EDIT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Price ($)</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-fuchsia-400" placeholder="0.00" />
        </div>
      </div>

      <ImagePicker value={form.image} onChange={(img) => update("image", img)} />

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-1">
          <Tag size={12} /> Discount
        </label>
        <div className="flex gap-2">
          <select value={form.discountType || ""} onChange={(e) => update("discountType", e.target.value || null)} className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-fuchsia-400 bg-white">
            <option value="">No discount</option>
            <option value="percent">% off</option>
            <option value="fixed">$ off</option>
          </select>
          {form.discountType && (
            <input
              type="number"
              min="0"
              value={form.discountValue}
              onChange={(e) => update("discountValue", e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-fuchsia-400"
              placeholder={form.discountType === "percent" ? "e.g. 20" : "e.g. 10"}
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-bold bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white hover:shadow-lg transition-all text-sm">
          <Save size={14} /> {isNew ? "Add Product" : "Save Changes"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-lg font-semibold text-slate-500 border-2 border-slate-200 hover:border-slate-400 transition-colors text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}

function AdminPanel({ products, onSaveProduct, onDelete, onExit }) {
  const [editingId, setEditingId] = useState(null); // null = none, "new" = new product, id = editing that product
  const editingProduct = editingId && editingId !== "new" ? products.find((p) => p.id === editingId) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-fuchsia-500" />
            <span className="font-bold text-lg">Aylol Admin</span>
          </div>
          <button onClick={onExit} className="text-sm font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1">
            <ChevronLeft size={14} /> Back to shop
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Products ({products.length})</h1>
          {editingId !== "new" && (
            <button onClick={() => setEditingId("new")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm">
              <PlusCircle size={16} /> Add Product
            </button>
          )}
        </div>

        {editingId === "new" && (
          <div className="mb-6">
            <ProductEditForm
              onSave={(data) => { onSaveProduct({ ...data, id: Date.now() }); setEditingId(null); }}
              onCancel={() => setEditingId(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p) =>
            editingId === p.id ? (
              <div key={p.id} className="sm:col-span-2">
                <ProductEditForm
                  product={p}
                  onSave={(data) => { onSaveProduct(data); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-3 flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <ProductMedia product={p} className="absolute inset-0 w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400 mb-1">{p.category}</p>
                  <div className="flex items-center gap-2">
                    {p.discountType && p.discountValue ? (
                      <>
                        <span className="text-fuchsia-600 font-bold text-sm">${finalPrice(p).toFixed(2)}</span>
                        <span className="text-slate-400 text-xs line-through">${p.price}</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-500 text-[10px] font-bold">
                          {p.discountType === "percent" ? `-${p.discountValue}%` : `-$${p.discountValue}`}
                        </span>
                      </>
                    ) : (
                      <span className="text-fuchsia-600 font-bold text-sm">${p.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => setEditingId(p.id)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => onDelete(p.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors text-red-500">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-400 text-sm">No products yet. Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- MAIN APP ----------

export default function App() {
  const [page, setPage] = useState("shop"); // shop | checkout | confirmation | admin-login | admin
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orderNum, setOrderNum] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

 async function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  } catch (e) {
    // no saved data yet, use defaults
  } finally {
    setLoading(false);
  }
}

async function persist(updated) {
  setProducts(updated);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaveError("");
  } catch (e) {
    setSaveError("Couldn't save changes — storage may be full.");
  }
}

  function saveProduct(data) {
    const exists = products.some((p) => p.id === data.id);
    const updated = exists ? products.map((p) => (p.id === data.id ? data : p)) : [data, ...products];
    persist(updated);
  }

  function deleteProduct(id) {
    persist(products.filter((p) => p.id !== id));
  }

  const filtered = useMemo(
    () => (activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory)),
    [activeCategory, products]
  );

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) return prev.map((i) => (i === existing ? { ...i, qty: i.qty + item.qty } : i));
      return [...prev, item];
    });
  }

  function updateQty(idx, qty) { setCart((prev) => prev.map((i, ix) => (ix === idx ? { ...i, qty } : i))); }
  function removeItem(idx) { setCart((prev) => prev.filter((_, ix) => ix !== idx)); }

  function handlePlaceOrder(form, total) {
    setOrderNum(Math.random().toString(36).slice(2, 8).toUpperCase());
    setOrderTotal(total);
    setCart([]);
    setPage("confirmation");
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  if (page === "admin-login") {
    return <AdminLogin onLogin={() => setPage("admin")} />;
  }

  if (page === "admin") {
    return (
      <AdminPanel
        products={products}
        onSaveProduct={saveProduct}
        onDelete={deleteProduct}
        onExit={() => setPage("shop")}
      />
    );
  }

  if (page === "checkout") {
    return <div className="min-h-screen bg-white"><CheckoutPage items={cart} onBack={() => setPage("shop")} onPlaceOrder={handlePlaceOrder} /></div>;
  }

  if (page === "confirmation") {
    return <div className="min-h-screen bg-white"><ConfirmationPage orderNum={orderNum} total={orderTotal} onContinue={() => setPage("shop")} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={22} className="text-fuchsia-500" />
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-fuchsia-600 to-orange-500 bg-clip-text text-transparent">Aylol</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage("admin-login")} className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:rotate-90 transition-all duration-300" title="Admin">
              <Settings size={16} />
            </button>
            <button onClick={() => setCartOpen(true)} className="relative w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all duration-200">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span key={cartCount} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fuchsia-500 text-white text-[10px] font-bold flex items-center justify-center" style={{ animation: "popIn 0.3s ease-out" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0); }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}</style>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 py-16 sm:py-24">
        <style>{`
          @keyframes floatBlob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -20px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.95); }
          }
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .hero-blob-1 { animation: floatBlob 8s ease-in-out infinite; }
          .hero-blob-2 { animation: floatBlob 10s ease-in-out infinite reverse; }
          .hero-fade-1 { animation: heroFadeUp 0.7s ease-out 0.05s both; }
          .hero-fade-2 { animation: heroFadeUp 0.7s ease-out 0.2s both; }
          .hero-fade-3 { animation: heroFadeUp 0.7s ease-out 0.35s both; }
          .hero-fade-4 { animation: heroFadeUp 0.7s ease-out 0.5s both; }
          .shimmer-btn {
            background: linear-gradient(90deg, #fff 25%, #fef3ff 50%, #fff 75%);
            background-size: 200% 100%;
            animation: shimmer 2.5s linear infinite;
          }
        `}</style>
        <div className="absolute w-72 h-72 rounded-full bg-white/20 blur-3xl hero-blob-1" style={{ top: "-10%", left: "10%" }} />
        <div className="absolute w-80 h-80 rounded-full bg-white/15 blur-3xl hero-blob-2" style={{ bottom: "-15%", right: "5%" }} />
        <div className="max-w-6xl mx-auto px-4 relative text-center">
          <p className="text-white/90 font-bold tracking-widest text-xs uppercase mb-3 hero-fade-1">New Drop</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight hero-fade-2">Wear the Color.<br />Own the Mood.</h1>
          <p className="text-white/90 max-w-md mx-auto mb-8 hero-fade-3">Bold fits, loud colors, zero apologies. Shop the collection that turns heads.</p>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("shop");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="hero-fade-4 shimmer-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-fuchsia-600 font-bold hover:scale-110 active:scale-95 transition-transform duration-200 shadow-lg cursor-pointer"
          >
            Shop the Drop <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <section id="shop" className="max-w-6xl mx-auto px-4 py-10">
        {saveError && <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{saveError}</div>}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95 ${activeCategory === cat ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} onClick={setSelectedProduct} index={index} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-100 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">© 2026 Aylol. Made for those who don't blend in.</div>
      </footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQty={updateQty} onRemove={removeItem} onCheckout={() => { setCartOpen(false); setPage("checkout"); }} />
    </div>
  );
}
