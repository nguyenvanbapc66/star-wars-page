import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Input,
  InputProps,
  Pagination,
  PaginationProps,
} from "antd";

import { MemberType, useListMember } from "@/api";
import { PaginationType } from "@/types";
import styles from "@/styles/main.module.css";
import { ModalMemberDetail } from "@/components/modals";
import { useDebounce, usePrevious } from "@/hooks";

const inter = Inter({ subsets: ["latin"] });

type OpenModalType = {
  status: boolean;
  detail: MemberType;
};

export default function Home() {
  const [pagination, setPagination] = useState<PaginationType>({ page: 1 });
  const [openModal, setOpenModal] = useState<OpenModalType>({
    status: false,
    detail: {} as OpenModalType["detail"],
  });
  const [valueSearch, setValueSearch] = useState<string>("");

  const debouncedValueSearch = useDebounce(valueSearch);
  const previousDebouncedValueSearch = usePrevious(debouncedValueSearch);
  const { data: listMembers, isLoading, error } = useListMember(pagination);

  const handleChangeInput: InputProps["onChange"] = (e) => {
    setValueSearch(e.target.value);
  };

  const handleShowMemberDetail = (detail: OpenModalType["detail"]) => {
    setOpenModal({
      status: true,
      detail,
    });
  };

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const itemRender: PaginationProps["itemRender"] = (
    page,
    type,
    originalElement
  ) => {
    if (type !== "page") {
      return (
        <div className={styles.paginationItemDisabled}>{originalElement}</div>
      );
    }

    if (type === "page") {
      return (
        <div
          className={
            page === pagination.page
              ? styles.paginationItemActive
              : styles.paginationItemDisabled
          }
        >
          <a className={styles.paginationItemLink}>{page}</a>
        </div>
      );
    }
    return originalElement;
  };

  const handleOnDismissModal = () => {
    setOpenModal({
      status: false,
      detail: {} as OpenModalType["detail"],
    });
  };

  useEffect(() => {
    if (previousDebouncedValueSearch !== debouncedValueSearch) {
      setPagination({
        page: 1,
        search: debouncedValueSearch,
      });
    }
  }, [debouncedValueSearch, previousDebouncedValueSearch]);

  if (error !== null) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center">
        <Empty />
        <p className="text-white">No Data</p>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen px-[200px] py-16 flex flex-col items-center ${inter.className}`}
    >
      <h1 className="text-center">Star Wars Members</h1>
      <Input
        value={valueSearch}
        placeholder="Search name.."
        className="max-w-xl mt-8"
        onChange={handleChangeInput}
      />
      <div className="flex flex-wrap justify-center mt-16 gap-3 max-w-5xl min-h-[300px]">
        {listMembers?.results.map((member, index) => (
          <Card key={index} className="w-fit h-fit" loading={isLoading}>
            <Card.Meta
              title={member.name}
              description={
                <Button
                  className="bg-[#8F14FF] text-white"
                  onClick={() => handleShowMemberDetail(member)}
                >
                  More detail
                </Button>
              }
            />
          </Card>
        ))}
      </div>
      {listMembers?.count && (
        <Pagination
          className="mt-4"
          align="center"
          current={pagination.page}
          total={listMembers?.count}
          showSizeChanger={false}
          onChange={handleChangePagination}
          itemRender={itemRender}
        />
      )}
      {openModal.status && (
        <ModalMemberDetail
          {...openModal.detail}
          onDismiss={handleOnDismissModal}
        />
      )}
    </main>
  );
}
