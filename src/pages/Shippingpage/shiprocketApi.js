// import { createContext, useContext, useReducer, useCallback } from "react";
// import { mockOrders, mockCouriers } from "../data/mockData";

// const ShippingContext = createContext(null);

// const initialState = {
//   orders: mockOrders,
//   couriers: mockCouriers,
//   selectedOrderIds: [],
//   loading: false,
//   toast: null,
//   shiprocketToken: localStorage.getItem("shiprocket_token") || null,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "SET_ORDERS":
//       return { ...state, orders: action.payload };

//     case "ADD_ORDER":
//       return { ...state, orders: [action.payload, ...state.orders] };

//     case "UPDATE_ORDER":
//       return {
//         ...state,
//         orders: state.orders.map((o) =>
//           o.id === action.payload.id ? { ...o, ...action.payload } : o
//         ),
//       };

//     case "CANCEL_ORDER":
//       return {
//         ...state,
//         orders: state.orders.map((o) =>
//           action.payload.includes(o.id)
//             ? { ...o, status: "cancelled", courier: "-", awb: "-" }
//             : o
//         ),
//       };

//     case "ASSIGN_COURIER":
//       return {
//         ...state,
//         orders: state.orders.map((o) =>
//           action.payload.orderIds.includes(o.id)
//             ? {
//                 ...o,
//                 status: "assigned",
//                 courier: action.payload.courierName,
//                 awb:
//                   "SR" +
//                   Math.floor(Math.random() * 900000000 + 100000000),
//               }
//             : o
//         ),
//       };

//     case "SET_SELECTED":
//       return { ...state, selectedOrderIds: action.payload };

//     case "TOGGLE_SELECT":
//       return {
//         ...state,
//         selectedOrderIds: state.selectedOrderIds.includes(action.payload)
//           ? state.selectedOrderIds.filter((id) => id !== action.payload)
//           : [...state.selectedOrderIds, action.payload],
//       };

//     case "SELECT_ALL":
//       return { ...state, selectedOrderIds: action.payload };

//     case "CLEAR_SELECTION":
//       return { ...state, selectedOrderIds: [] };

//     case "SET_LOADING":
//       return { ...state, loading: action.payload };

//     case "SHOW_TOAST":
//       return { ...state, toast: action.payload };

//     case "CLEAR_TOAST":
//       return { ...state, toast: null };

//     case "SET_TOKEN":
//       return { ...state, shiprocketToken: action.payload };

//     case "UPDATE_NDR":
//       return {
//         ...state,
//         orders: state.orders.map((o) =>
//           o.id === action.payload.id
//             ? { ...o, status: action.payload.status }
//             : o
//         ),
//       };

//     default:
//       return state;
//   }
// }

// export function ShippingProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const showToast = useCallback((message, type = "default") => {
//     dispatch({ type: "SHOW_TOAST", payload: { message, type } });
//     setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3000);
//   }, []);

//   return (
//     <ShippingContext.Provider value={{ state, dispatch, showToast }}>
//       {children}
//     </ShippingContext.Provider>
//   );
// }

// export const useShipping = () => {
//   const ctx = useContext(ShippingContext);
//   if (!ctx) throw new Error("useShipping must be inside ShippingProvider");
//   return ctx;
// };