import Link from "next/link";

type AuthNavLinkProps = {
  text: string;
  linkText: string;
  href: string;
};

export function AuthNavLink({ text, linkText, href }: AuthNavLinkProps) {
  return (
    <p className="text-center text-sm text-gray-500">
      {text}{" "}
      <Link href={href} className="text-blue-500 hover:underline font-medium">
        {linkText}
      </Link>
    </p>
  );
}
