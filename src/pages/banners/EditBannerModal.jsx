import { Modal } from "../../components/common/Modal";
import { useBannerStore } from "../../store/useBannerStore";
import BannerForm from "./BannerForm";

export default function EditBannerModal({ banner, onClose }) {
  const { updateBanner, loading } = useBannerStore();

  const handleSubmit = async (formData) => {
    const success = await updateBanner(banner._id, formData);

    if (success) {
      onClose();
    }
  };

  return (
    <Modal title="Edit Banner" onClose={onClose}>
      <BannerForm
        initial={{
          title: banner?.title || "",
          subtitle: banner?.subtitle || "",
          description: banner?.description || "",
          type: banner?.type || "",
          page: banner?.page || "",
          section: banner?.section || "",
          order: banner?.order || "",
          isActive: banner?.isActive ?? true,
          buttons: banner?.buttons || [],
           image: banner?.image || "",
        }}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Modal>
  );
}