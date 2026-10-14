/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCourseStore } from "../../store/useCourseStore";
import AddCourse from "./Addcourse";

export default function EditCourseWrapper() {
  const { id } = useParams();
  const { getCourseById } = useCourseStore();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      getCourseById(id).then(setData);
    }
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return <AddCourse editData={data} />;
}