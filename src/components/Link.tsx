import { ArrowRight, Link as LinkIcon } from "../assets/icons";

export default function Link({ href, title }: { href: string; title: string }) {
  return (
    <a
      href={href}
      className={`w-full inline-flex items-center justify-center p-3 text-gray-500 rounded
         bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white`}
      target="_blank"
      rel="noreferrer"
    >
      <LinkIcon />
      <span className="w-full">{title}</span>
      <ArrowRight />
    </a>
  );
}
