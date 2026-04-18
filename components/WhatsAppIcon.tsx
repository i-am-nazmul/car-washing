import Image from "next/image";

type WhatsAppIconProps = {
  className?: string;
};

export default function WhatsAppIcon({ className }: WhatsAppIconProps) {
  return (
    <Image
      src="/w1.png"
      alt="WhatsApp"
      width={40}
      height={40}
      className={className}
      aria-hidden="true"
    />
  );
}
