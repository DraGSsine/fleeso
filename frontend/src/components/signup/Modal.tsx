import React from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { UploadDropzone } from "../dashboard/DropZone";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setUploadModal } from "@/redux/slices/filesSlices";

export default function ModalComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const { uploadFileState } = useSelector((state: RootState) => state.files);
  return (
    <>
      <Modal
        backdrop="opaque"
        isOpen={uploadFileState.openUploadModal}
        onClose={() => dispatch(setUploadModal(false))}
        size="xl"
        radius="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#fff]/40 backdrop-opacity-40 blur-xs",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalBody className="bg-zinc-100">
            <UploadDropzone/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
