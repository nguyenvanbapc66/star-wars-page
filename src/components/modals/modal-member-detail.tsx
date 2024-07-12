import { MemberType } from "@/api";
import { images } from "@/assets";
import { Modal } from "antd";
import Image from "next/image";

type ModalMemberDetailType = MemberType & {
  onDismiss?: () => void;
};

export const ModalMemberDetail = ({
  name,
  height,
  mass,
  birth_year,
  gender,
  onDismiss,
}: ModalMemberDetailType) => {
  const formattedName = name
    .replace(/\s/g, "_")
    .replace(new RegExp("-", "g"), "_")
    .toLowerCase();

  return (
    <Modal title={name} open onCancel={onDismiss} footer={null}>
      {images[formattedName] && <Image src={images[formattedName]} alt="" />}
      <ul className="list-disc ml-4 mt-2">
        <li>Height: {Number(height) / 100}m</li>
        <li>Mass: {mass}kg</li>
        <li>Birth year: {birth_year}</li>
        <li>Gender: {gender}</li>
      </ul>
    </Modal>
  );
};
