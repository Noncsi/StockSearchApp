import React from "react";

export default function LabelValuePairComponent({
  label,
  value,
  isPrice = false,
}: {
  label: string;
  value: string;
  isPrice?: boolean;
}) {
  return (
    <div key={label} className="text-center">
      <div className="text-slate-500">{label}</div>
      <div className="text-xl font-medium">
        {isPrice && "$"}
        {value}
      </div>
    </div>
  );
}
