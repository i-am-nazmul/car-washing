"use client";

import React from "react";
import * as motion from "motion/react-client";

export type CartItem = {
  id: string;
  planName: string;
  vehicleCategory: string;
  displayPrice: string;
  unitPrice: number;
  quantity: number;
};

type CartSidebarProps = {
  isOpen: boolean;
  items: CartItem[];
  discount: number;
  subtotal: number;
  total: number;
  onClose: () => void;
  onRemove: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onCheckout: () => void;
};

export default function CartSidebar({
  isOpen,
  items,
  discount,
  subtotal,
  total,
  onClose,
  onRemove,
  onIncrement,
  onDecrement,
  onCheckout,
}: CartSidebarProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <motion.aside
        className="absolute right-0 top-0 h-full w-full max-w-md border-l border-amber-200/20 bg-[#050b28] p-6 text-amber-100 shadow-[0_0_30px_rgba(253,230,138,0.15)]"
        initial={{ x: 384 }}
        animate={{ x: 0 }}
        exit={{ x: 384 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-amber-200">Your Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-amber-200/30 px-3 py-1 text-sm font-semibold text-amber-100 hover:bg-amber-200/10 transition"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-amber-200/20 bg-[#060b26] p-4 text-sm text-amber-100/80">
            Your cart is empty.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-amber-200/20 bg-[#060b26] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-amber-100">{item.planName}</div>
                    <div className="text-sm text-amber-100/70">{item.vehicleCategory}</div>
                    <div className="mt-2 text-sm text-amber-100/80">{item.displayPrice} / Month</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="cursor-pointer rounded-lg border border-amber-200/30 px-2 py-1 text-xs font-semibold text-amber-100 hover:bg-amber-200/10 transition"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.id)}
                      className="cursor-pointer h-8 w-8 rounded-lg border border-amber-200/30 text-amber-100 hover:bg-amber-200/10 transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onIncrement(item.id)}
                      className="cursor-pointer h-8 w-8 rounded-lg border border-amber-200/30 text-amber-100 hover:bg-amber-200/10 transition"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-semibold text-amber-100">
                    ₹{item.unitPrice * item.quantity}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-amber-200/20 bg-[#060b26] p-4 text-sm text-amber-100/80">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-amber-100">₹{subtotal}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Multi-plan discount</span>
                <span className="text-amber-200">-₹{discount}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-base font-semibold text-amber-100">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="mt-2 w-full cursor-pointer rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-3 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition"
            >
              Checkout
            </button>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}
