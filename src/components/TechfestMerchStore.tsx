/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, HelpCircle, CheckCircle, Shield, Play } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface TechfestMerchStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number; // in Cyber-Fest Tokens CFT (or INR)
  size?: string;
  quantity: number;
}

export default function TechfestMerchStore({ isOpen, onClose }: TechfestMerchStoreProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    exo_jacket: 'L',
    cyber_hoodie: 'M'
  });

  // Checkout flows states
  const [isCheckoutInProgress, setIsCheckoutInProgress] = useState<boolean>(false);
  const [checkoutProgress, setCheckoutProgress] = useState<number>(0);
  const [checkoutReceipt, setCheckoutReceipt] = useState<{
    id: string;
    total: number;
    items: CartItem[];
  } | null>(null);

  if (!isOpen) return null;

  const products = [
    {
      id: 'exo_jacket',
      name: 'TRON EXO-JACKET 2050',
      price: 1800, // credits/CFT
      description: 'Futuristic water-resistant outerwear, integrated with modular neon fiber conduits displaying kinetic wave formations.',
      sizes: ['S', 'M', 'L', 'XL'],
      imageText: '🧥 EXO_CONDUIT_STB: 100%'
    },
    {
      id: 'cyber_hoodie',
      name: 'QUANTUM CYBER-HOODIE',
      price: 1200,
      description: 'Ultra-soft graphene fleece hoodie, featuring anti-scanning patterns and custom holographic Techfest IIT Bombay logos.',
      sizes: ['S', 'M', 'L', 'XL'],
      imageText: '👕 GRAPHENE_CORE_STRETCH'
    },
    {
      id: 'smart_mug',
      name: 'AGI SMART-INFUSER MUG',
      price: 450,
      description: 'Vacuum-insulated smart infuser keeping fluid temperatures locked. Synchronizes temperature readings back to your main wristband.',
      sizes: [],
      imageText: '☕ THERMOSTEM_CONN: 37C'
    },
    {
      id: 'sticks',
      name: 'HOLOGRAPHIC DECAL DECOUPLERS',
      price: 150,
      description: 'Set of 6 adhesive quantum stickers, emitting passive visual colors based on ambient light coordinates.',
      sizes: [],
      imageText: '✨ HOLO_GRID_REFLECT'
    }
  ];

  const addToCart = (prod: typeof products[0]) => {
    audioEngine.playClick();
    const size = prod.sizes.length > 0 ? selectedSizes[prod.id] || 'M' : undefined;

    setCart(prevCart => {
      // Check if duplicate exist
      const existing = prevCart.find(i => i.id === prod.id && i.size === size);
      if (existing) {
        return prevCart.map(i => i.id === prod.id && i.size === size 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...prevCart, { id: prod.id, name: prod.name, price: prod.price, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size?: string) => {
    audioEngine.playClick();
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size)));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const startCheckoutSimulation = () => {
    if (cart.length === 0) return;
    audioEngine.playQuantum();
    setIsCheckoutInProgress(true);
    setCheckoutProgress(0);

    // Dynamic timer incrementing progress counter
    let prg = 0;
    const interval = setInterval(() => {
      prg += 10;
      setCheckoutProgress(prg);
      audioEngine.playClick();

      if (prg >= 100) {
        clearInterval(interval);
        audioEngine.playSpace();
        
        // Complete checkout!
        setCheckoutReceipt({
          id: `IITB-CFT-TX-${Math.floor(100000 + Math.random() * 900000)}`,
          total: cartTotal,
          items: [...cart]
        });
        setCart([]); // Clear original cart
        setIsCheckoutInProgress(false);
      }
    }, 280);
  };

  return (
    <div className="absolute inset-0 bg-[#020204]/96 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl h-[88vh] border border-[#00f5ff]/25 bg-black/95 relative flex flex-col overflow-hidden shadow-[0_0_55px_rgba(0,245,255,0.15)]">
        
        {/* Swiping scanner bar */}
        <div className="absolute inset-x-0 h-[2px] bg-[#00f5ff] top-0 pointer-events-none anim-laser-sweep"></div>

        {/* Modal Header */}
        <div className="border-b border-slate-850 p-4 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-orange-500/35 flex items-center justify-center text-orange-400 font-bold font-mono text-xs">
              S
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#f43f5e] tracking-widest font-black block uppercase leading-none">
                IITB_META_VESSEL // MERCH_GEOSYNC
              </span>
              <h2 className="text-base md:text-xl font-display font-black tracking-wider text-white">
                TECHFEST FUTURISTIC MERCH COMPARTMENT
              </h2>
            </div>
          </div>

          <button
            onClick={() => { audioEngine.playClick(); onClose(); }}
            className="px-4 py-2 border border-[#00f5ff]/25 text-[#00f5ff] hover:text-white hover:border-[#00f5ff] font-mono text-[10.5px] tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors"
          >
            Close Locker <X size={14} />
          </button>
        </div>

        {/* Core Layout Drawer */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-[#030307]">
          
          {/* Left Grid: Products catalog */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            
            {checkoutReceipt ? (
              // Receipt overlay screen
              <div className="max-w-md mx-auto border border-green-500/35 bg-black/85 p-6 space-y-4 font-mono text-[11px] text-left">
                <div className="w-12 h-12 rounded-full bg-green-950 text-green-400 border border-green-500/30 flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle size={24} />
                </div>

                <div className="text-center">
                  <h3 className="font-display font-black text-base text-white uppercase tracking-wider mb-1">TRANSACTION COMPLETE</h3>
                  <span className="text-[9.5px] text-[#10b981] font-bold uppercase tracking-widest leading-none">VALIDS NOMINAL // KEYS STORED</span>
                </div>

                <div className="border-t border-b border-slate-850 py-3 space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>RECEIPT TOKEN ID:</span>
                    <span className="text-white font-bold">{checkoutReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CREDITS ENROUTE (CFT):</span>
                    <span className="text-[#00f5ff] font-bold">{checkoutReceipt.total} CFT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GRID SHIFT DESTINATION:</span>
                    <span className="text-slate-400">IIT BOMBAY METAVERSE SHIP</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[8.5px] text-slate-500 font-bold block uppercase pb-1">INCLUDED SHIPPED ITEMS:</span>
                  <ul className="space-y-1 text-slate-400">
                    {checkoutReceipt.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>• {item.name} {item.size ? `[Size: ${item.size}]` : ''} x {item.quantity}</span>
                        <span>{item.price * item.quantity} CFT</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => { audioEngine.playClick(); setCheckoutReceipt(null); }}
                  className="w-full py-2.5 bg-[#00f5ff] hover:bg-white text-black font-display font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  Return to Storefront
                </button>
              </div>
            ) : (
              // General visual products card grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(prod => (
                  <div key={prod.id} className="border border-slate-850 bg-black/40 p-5 flex flex-col justify-between group hover:border-[#00f5ff]/40 transition-colors">
                    
                    <div>
                      {/* Decorative wireframe visual outline */}
                      <div className="w-full h-28 bg-slate-950 border border-slate-900 flex flex-col items-center justify-center p-3 relative font-mono text-[10px] text-slate-400 mb-3 select-none">
                        <span className="text-[#00f5ff] font-bold block animate-pulse mb-1">{prod.imageText.split(' ')[0]}</span>
                        <span className="text-[8px] text-slate-550 block uppercase tracking-wide">{prod.imageText.slice(prod.imageText.indexOf(' ') + 1)}</span>
                        
                        {/* Shimmer laser highlight on hover */}
                        <div className="absolute inset-x-0 h-[1px] bg-[#00f5ff]/25 bottom-1"></div>
                      </div>

                      <h3 className="font-display font-black text-sm text-white uppercase tracking-wider group-hover:text-[#00f5ff] transition-colors leading-tight">
                        {prod.name}
                      </h3>
                      <p className="font-sans text-xs text-slate-400 leading-normal font-light mt-1.5">{prod.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-900 mt-4 flex items-center justify-between font-mono">
                      <div>
                        <span className="text-slate-550 text-[9px] block">PRICE AMOUNT:</span>
                        <span className="text-[#00f5ff] font-bold text-sm">{prod.price} CFT</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        {/* Size selections */}
                        {prod.sizes.length > 0 && (
                          <select
                            value={selectedSizes[prod.id] || 'M'}
                            onChange={(e) => setSelectedSizes({ ...selectedSizes, [prod.id]: e.target.value })}
                            className="bg-black border border-slate-800 text-xs px-2 py-1 outline-none text-slate-300"
                          >
                            {prod.sizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        )}

                        <button
                          onClick={() => addToCart(prod)}
                          className="px-4 py-1.5 bg-[#00f5ff] text-black font-display font-black text-[10px] uppercase tracking-wider hover:bg-white cursor-pointer"
                        >
                          ADD TO DOCK
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right: Cart and simulation panel */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-850 p-4 md:p-6 bg-[#020204]/80 flex flex-col justify-between font-mono text-[11px] h-full overflow-y-auto">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                <ShoppingBag size={14} className="text-orange-400" />
                <span className="text-xs text-slate-350 font-bold uppercase tracking-wider">SECURE_CART_LOCKER</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-550 uppercase text-[10px] leading-relaxed">
                  Locker cargo empty. Select decals or apparel to fill dock coordinates.
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="p-2 border border-slate-900 bg-black/40 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-white block font-sans truncate font-bold uppercase max-w-[150px]">{item.name}</span>
                        <span className="text-[9px] text-[#00f5ff] font-bold">
                          {item.quantity} x {item.price} CFT {item.size ? `[${item.size}]` : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-[#f43f5e] hover:text-white transition-colors p-1"
                        title="Trash item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total checkout operations details */}
            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-900">
                <div className="space-y-1.5 text-slate-350">
                  <div className="flex justify-between">
                    <span>CARGO SUB-TOTAL:</span>
                    <span>{cartTotal} CFT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>QUANTUM COMPRESSION INCLUDED:</span>
                    <span className="text-[#10b981]">FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-850 pt-2 text-[#00f5ff] font-bold text-xs">
                    <span>TOTAL LIQUEFACTION VALUE:</span>
                    <span>{cartTotal} CFT</span>
                  </div>
                </div>

                {isCheckoutInProgress ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="flex justify-between text-[9px] text-purple-400 uppercase tracking-widest font-bold">
                      <span>DECRYPTING TRANSACTION CODES...</span>
                      <span>{checkoutProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#a855f7] h-full transition-all duration-300" style={{ width: `${checkoutProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={startCheckoutSimulation}
                    className="w-full py-3 bg-orange-500 text-black font-display font-black text-xs uppercase tracking-widest hover:bg-white cursor-pointer transition-colors shrink-0"
                  >
                    DEPLOY SECURE TRANSACTION
                  </button>
                )}

                <div className="text-[9px] text-slate-500 leading-snug flex gap-1.5 items-start">
                  <Shield size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>CFT represents Cyber-Fest Tokens, standard simulation credits verified on the Bombay campus.</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
