import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 text-center text-sm text-gray-500">
      <p>
        © 2025. Built with{" "}
        <Heart className="inline w-4 h-4 text-red-500 mx-1" /> using{" "}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}
