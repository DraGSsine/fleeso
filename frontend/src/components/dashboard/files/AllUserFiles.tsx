import React, { ReactNode, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import FilesSettings from "./FilesSettings";
import Image from "next/image";
import {
  FormatTheDate,
  bytesToMegaBytes,
  getFileImage,
} from "@/helpers/helpers";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteManyFiles,
  loaAlldFiles,
  resetFiles,
  setConfirmFileRemove,
  setConfirmManyFileRemove,
} from "@/redux/slices/filesSlices";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function AllUsersFiles() {
  const dispatch = useDispatch<AppDispatch>();
  const { loadFiles, removeFile, removeManyFiles, uploadFile } = useSelector(
    (state: RootState) => state.files
  );
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 20;

  const pages = Math.ceil(loadFiles.files.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return loadFiles.files.slice(start, end);
  }, [page, loadFiles.files]);

  const removeSelectedKeys = () => {
    dispatch(
      setConfirmManyFileRemove({
        active: true,
        files: Array.from(selectedKeys),
      })
    );
    setSelectedKeys(new Set([]));
  };

  useEffect(() => {
    dispatch(loaAlldFiles(null));
    if (loadFiles.error) {
      toast.error("Failed to load files");
    }
    switch (true) {
      case removeFile.isFileDeleted:
        toast.success("File deleted successfully");
        dispatch(setConfirmFileRemove({ active: false, fileId: "" }));
        break;
      case removeManyFiles.isManyFileDeleted:
        toast.success("Files deleted successfully");
        break;
      case uploadFile.isFileUploaded:
        toast.success("Files uploaded successfully");
        break;
    }
    dispatch(resetFiles());
  }, [
    removeFile.isFileDeleted,
    removeManyFiles.isManyFileDeleted,
    uploadFile.isFileUploaded,
  ]);
  return (
    <Table
      BaseComponent={TableWraper}
      aria-label="Controlled table example with dynamic content"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        let allKeys = new Set<string>([]);
        if (keys == "all") {
          loadFiles.files.map((file) => {
            allKeys.add(file.id);
            setSelectedKeys(allKeys);
          });
        } else {
          setSelectedKeys(keys);
        }
      }}
      topContent={
        selectedKeys.size > 0 && (
          <div className="flex left-[11px] top-[50px] absolute items-center justify-between">
            <div>
              <Tooltip content="Delete All">
                <Trash2
                  size={20}
                  className="cursor-pointer text-red-500"
                  onClick={() => removeSelectedKeys()}
                />
              </Tooltip>
            </div>
          </div>
        )
      }
      bottomContent={
        <div className="flex w-full justify-center absolute bottom-10  ">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn className=" w-[40%] " key="name">
          FILE
        </TableColumn>
        <TableColumn className=" text-center w-[15%]" key="size">
          SIZE
        </TableColumn>
        <TableColumn className=" text-center w-[15%]" key="createdAt">
          CREATED AT
        </TableColumn>
        <TableColumn className=" text-center w-[15%]" key="status">
          STATUS
        </TableColumn>
        <TableColumn className=" w-[15%] text-center" key="settings">
          SETTINGS
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="No files to load"
        isLoading={loadFiles.isLoading}
        loadingContent={<Spinner />}
        items={items}
      >
        {(item) => (
          <TableRow
            key={item.id}
            className=" cursor-pointer hover:bg-zinc-50 text-xl"
          >
            <TableCell>
              <div className="flex items-center space-x-4">
                <Image
                  src={getFileImage(item.format)}
                  alt="file"
                  width={40}
                  height={40}
                  className="rounded-md -ml-2"
                />
                <span>{item.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-center">{bytesToMegaBytes(item.size)}</TableCell>
            <TableCell className="text-center">{FormatTheDate(item.createdAt)}</TableCell>
            <TableCell className="text-center">
              <Chip
                size="sm"
                color="warning"
                variant="dot"
                style={{ borderColor: "orange", borderWidth: 1 }}
              >
                {item.topic}
              </Chip>
            </TableCell>
            <TableCell className="text-center">
              <FilesSettings  fileId={item.id} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const TableWraper = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" h-[86.8vh] relative bg-white rounded-t-2xl p-10  shadow-small">
      {children}
    </div>
  );
};
