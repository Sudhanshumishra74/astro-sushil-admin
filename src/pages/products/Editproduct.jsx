/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import AddProduct from "./Addproduct";


export default function EditProduct() {
  const { id } = useParams();
  const { product, fetchProductById, resetProduct, loading } = useProductStore();

  useEffect(() => {
    fetchProductById(id);
    return () => resetProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 rounded-full border-[3px] border-[#6c63ff]/20 border-t-[#6c63ff] animate-spin" />
          <p className="text-sm text-[#9a9abf] font-medium">Loading product…</p>
        </div>
      </div>
    );
  }

  return <AddProduct editData={product} />;
}