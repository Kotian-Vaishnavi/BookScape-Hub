import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (i) => i._id === item._id && i.seller === item.seller
      );

      if (!existingItem) {
        state.cartItems.push(item);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Product Added to the Cart",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Already Added to the Cart",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK!",
        });
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item._id === action.payload._id &&
            item.seller === action.payload.seller
          )
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    updateCartItemSeller: (state, action) => {
      const { _id, seller, price } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (existingItem) {
        existingItem.seller = seller;
        existingItem.newPrice = price;
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Cart item updated with new seller/price",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, clearCart, updateCartItemSeller } =
  cartSlice.actions;

export default cartSlice.reducer;
