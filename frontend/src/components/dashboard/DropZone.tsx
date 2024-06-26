"use client";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { Cloud, File, FileWarning, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProgressBar from "./Progress";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setUploadModal, uploadFiles } from "@/redux/slices/filesSlices";

export const UploadDropzone = () => {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { uploadFileState } = useSelector((state: RootState) => state.files);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSimulatedProgress = () => {
    setLoading(true);
    setUploadProgress(0);
    intervalRef.current = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress < 95) {
          return prevProgress + Math.floor(Math.random() * 5);
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return prevProgress;
        }
      });
    }, 500);
  };

  useEffect(() => {
    if (uploadFileState.isFileUploaded) {
      setUploadProgress(100);
      toast.success("File uploaded successfully");
      setTimeout(() => {
        dispatch(setUploadModal(false));
        router.push("/dashboard/repository");
      }, 2000);
    } else if (uploadFileState.error) {
      toast.error(uploadFileState.error.message || "File upload failed");
      setLoading(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [uploadFileState.isFileUploaded, uploadFileState.error, dispatch, router]);

  return (
    <Dropzone
      multiple
      onDrop={async (acceptedFiles) => {
        const formData = new FormData();
        startSimulatedProgress();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });
        dispatch(uploadFiles(formData));
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-96 w-[500px] m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 20MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {loading && (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <ProgressBar
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                  />
                  {uploadProgress === 100 && (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  )}
                </div>
              )}
              {uploadFileState.error && (
                <div className=" flex gap-4 items-center justify-center py-6">
                  <p className="text-danger-500 text-medium">
                    Filed to Upload files{" "}
                  </p>
                  <FileWarning size={20} className=" stroke-danger-500" />
                </div>
              )}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
