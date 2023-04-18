import React from "react";
import DonorBox from "../DonorBox";

interface Props {
  amount: number;
}

const ModalBox: React.FC<Props> = ({ amount }) => {
  console.log(amount+"HUHUR");
  return (
    <div className="fixed z-50 right-[40%] py-16">
      <DonorBox amount={amount} />
    </div>
  );
};

export default ModalBox;
