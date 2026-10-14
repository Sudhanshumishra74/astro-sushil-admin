/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBlogStore } from "../../store/Useblogstore";
import AddBlog from "./Addblog";


export default function EditBlog() {
  const { id } = useParams();
  const { blog, fetchBlogById, resetBlog, loading } = useBlogStore();

  useEffect(() => {
    fetchBlogById(id);
    return () => resetBlog();
  }, [id]);

  if (loading || !blog) {
    return (
      <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 rounded-full border-[3px] border-[#6c63ff]/20 border-t-[#6c63ff] animate-spin" />
          <p className="text-sm text-[#9a9abf] font-medium">Loading blog…</p>
        </div>
      </div>
    );
  }

  return <AddBlog editData={blog} />;
}