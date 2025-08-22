// "use client";

// import React, { createContext, useContext, useReducer, useEffect } from "react";

// const CartContext = createContext();

// // Cart reducer
// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case "ADD_TO_CART": {
//       const { product } = action.payload;
//       const existingItemIndex = (state.items || []).findIndex(
//         (item) => item._id === product._id && item.selectedSize === product.selectedSize,
//       );

//       if (existingItemIndex > -1) {
//         const updatedItems = [...(state.items || [])];
//         updatedItems[existingItemIndex].quantity += product.quantity || 1;
//         return { ...state, items: updatedItems };
//       } else {
//         return {
//           ...state,
//           items: [...(state.items || []), { ...product, quantity: product.quantity || 1 }],
//         };
//       }
//     }

//     case "REMOVE_FROM_CART": {
//       const { productId, selectedSize } = action.payload;
//       return {
//         ...state,
//         items: (state.items || []).filter(
//           (item) => !(item._id === productId && item.selectedSize === selectedSize),
//         ),
//       };
//     }

//     case "UPDATE_QUANTITY": {
//       const { productId, selectedSize, quantity } = action.payload;
//       return {
//         ...state,
//         items: (state.items || [])
//           .map((item) =>
//             item._id === productId && item.selectedSize === selectedSize
//               ? { ...item, quantity: Math.max(0, quantity) }
//               : item,
//           )
//           .filter((item) => item.quantity > 0),
//       };
//     }

//     case "CLEAR_CART":
//       return { ...state, items: [] };

//     case "LOAD_CART":
//       return { ...state, items: action.payload || [] };

//     default:
//       return state;
//   }
// };

// // Initial state
// const initialState = {
//   items: [],
// };

// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     try {
//       const savedCart = localStorage.getItem("cart");
//       if (savedCart) {
//         const parsedCart = JSON.parse(savedCart);
//         dispatch({ type: "LOAD_CART", payload: parsedCart });
//       }
//     } catch (error) {
//       console.error("Error loading cart from localStorage:", error);
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     try {
//       localStorage.setItem("cart", JSON.stringify(state.items || []));
//     } catch (error) {
//       console.error("Error saving cart to localStorage:", error);
//     }
//   }, [state.items]);

//   // Cart actions
//   const addToCart = (product) => {
//     try {
//       dispatch({ type: "ADD_TO_CART", payload: { product } });
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   const removeFromCart = (productId, selectedSize) => {
//     try {
//       dispatch({ type: "REMOVE_FROM_CART", payload: { productId, selectedSize } });
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//     }
//   };

//   const updateQuantity = (productId, selectedSize, quantity) => {
//     try {
//       dispatch({ type: "UPDATE_QUANTITY", payload: { productId, selectedSize, quantity } });
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//     }
//   };

//   const clearCart = () => {
//     try {
//       dispatch({ type: "CLEAR_CART" });
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//     }
//   };

//   const getCartTotal = () => {
//     try {
//       return (state.items || []).reduce((total, item) => {
//         return total + ((item.price || 0) * (item.quantity || 1));
//       }, 0);
//     } catch (error) {
//       console.error("Error calculating cart total:", error);
//       return 0;
//     }
//   };

//   const getCartItemsCount = () => {
//     try {
//       return (state.items || []).reduce((total, item) => total + (item.quantity || 1), 0);
//     } catch (error) {
//       console.error("Error counting cart items:", error);
//       return 0;
//     }
//   };

//   const value = {
//     cartItems: state.items || [],
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     console.warn("useCart must be used within a CartProvider");
//     return {
//       cartItems: [],
//       addToCart: () => {},
//       removeFromCart: () => {},
//       updateQuantity: () => {},
//       clearCart: () => {},
//       getCartTotal: () => 0,
//       getCartItemsCount: () => 0,
//     };
//   }
//   return context;
// };

// export default CartContext;























"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

const CartContext = createContext()

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product } = action.payload
      const existingItemIndex = (state.items || []).findIndex(
        (item) => item._id === product._id && item.selectedSize === product.selectedSize,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...(state.items || [])]
        updatedItems[existingItemIndex].quantity += product.quantity || 1
        return { ...state, items: updatedItems }
      } else {
        return {
          ...state,
          items: [...(state.items || []), { ...product, quantity: product.quantity || 1 }],
        }
      }
    }

    case "REMOVE_FROM_CART": {
      const { productId, selectedSize } = action.payload
      return {
        ...state,
        items: (state.items || []).filter((item) => !(item._id === productId && item.selectedSize === selectedSize)),
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, selectedSize, quantity } = action.payload
      return {
        ...state,
        items: (state.items || [])
          .map((item) =>
            item._id === productId && item.selectedSize === selectedSize
              ? { ...item, quantity: Math.max(0, quantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }
    }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "LOAD_CART":
      return { ...state, items: action.payload || [] }

    default:
      return state
  }
}

// Initial state
const initialState = {
  items: [],
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      // Clear corrupted cart data
      localStorage.removeItem("cart")
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify(state.items || []))
      }, 100)

      return () => clearTimeout(timeoutId)
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state.items])

  // Cart actions
  const addToCart = (product, selectedSize, quantity = 1) => {
    try {
      const cartProduct = {
        ...product,
        selectedSize,
        quantity,
        // Ensure we have the right price for the selected size
        price: product.sizes?.find((s) => s.name === selectedSize)?.price || product.price || 0,
      }
      dispatch({ type: "ADD_TO_CART", payload: { product: cartProduct } })
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const removeFromCart = (productId, selectedSize) => {
    try {
      dispatch({ type: "REMOVE_FROM_CART", payload: { productId, selectedSize } })
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const updateQuantity = (productId, selectedSize, quantity) => {
    try {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, selectedSize, quantity } })
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const clearCart = () => {
    try {
      dispatch({ type: "CLEAR_CART" })
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  const getCartTotal = () => {
    try {
      return (state.items || []).reduce((total, item) => {
        return total + (item.price || 0) * (item.quantity || 1)
      }, 0)
    } catch (error) {
      console.error("Error calculating cart total:", error)
      return 0
    }
  }

  const getCartItemsCount = () => {
    try {
      return (state.items || []).reduce((total, item) => total + (item.quantity || 1), 0)
    } catch (error) {
      console.error("Error counting cart items:", error)
      return 0
    }
  }

  const value = {
    cartItems: state.items || [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    console.warn("useCart must be used within a CartProvider")
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getCartTotal: () => 0,
      getCartItemsCount: () => 0,
    }
  }
  return context
}

export default CartContext

