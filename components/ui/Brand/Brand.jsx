import Image from "next/image";

const Brand = ({ ...props }) => (
  <div className="flex items-center space-x-2">
    <Image
      src="/images/happy/happy-berry-logo.png"
      alt="Mailgo logo"
      {...props}
      width={70}
      height={70}
      priority
    />
    <span className="text-lg font-semibold">Happy Berry</span>
  </div>
);

export default Brand;
